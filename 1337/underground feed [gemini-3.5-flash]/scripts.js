document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ENGINE ---
    const state = {
        traceLevel: 14,
        maxTrace: 100,
        isEmergencyActive: false,
        activeFilter: 'all'
    };

    // --- DOM TARGETS ---
    const postsContainer = document.getElementById('posts-container');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const traceBar = document.getElementById('trace-bar');
    const traceVal = document.getElementById('trace-val');
    const postTextarea = document.getElementById('post-textarea');
    const submitPostBtn = document.getElementById('submit-post-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const alarmOverlay = document.getElementById('alarm-overlay');
    const purgeBtn = document.getElementById('purge-button');
    const rerouteProgress = document.getElementById('reroute-progress');

    // --- TEXT DECRYPTION SYSTEM (MATRIX GLITCH EFFECT) ---
    const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_@#$&%*+=-/<>[]';

    function decryptElement(element) {
        if (element.classList.contains('decrypted')) return;
        
        const originalText = element.getAttribute('data-original');
        let currentIteration = 0;
        element.classList.add('decrypted');

        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < currentIteration) {
                        return originalText[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            if (currentIteration >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
                // Add trace on decryption
                increaseTraceLevel(Math.floor(Math.random() * 4) + 2);
            }
            currentIteration += Math.ceil(originalText.length / 20);
        }, 30);
    }

    // Assign hover and manual trigger actions to existing/new cards
    function bindCardDecryption(card) {
        const encryptedPara = card.querySelector('.encrypted-text');
        const decryptBtn = card.querySelector('.decrypt-trigger');

        if (encryptedPara) {
            encryptedPara.addEventListener('mouseenter', () => decryptElement(encryptedPara));
        }
        if (decryptBtn && encryptedPara) {
            decryptBtn.addEventListener('click', () => decryptElement(encryptedPara));
        }
    }

    // Apply to initial markup posts
    document.querySelectorAll('.post-card').forEach(bindCardDecryption);

    // --- TERMINAL ENGINE ---
    function printTerminalLine(text, cssClass = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${cssClass}`;
        line.innerText = `> ${text}`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (!command) return;

            printTerminalLine(command, 'text-green');
            terminalInput.value = '';

            processCommand(command);
        }
    });

    function processCommand(cmd) {
        const lowerCmd = cmd.toLowerCase();
        
        if (lowerCmd === '/help') {
            printTerminalLine('AVAILABLE INTERFACES:', 'text-dim');
            printTerminalLine('/clear - Clear monitor diagnostics');
            printTerminalLine('/trace - Query host tracking latency');
            printTerminalLine('/ping - Probe subnet gateways');
            printTerminalLine('/rep - Query local grid reputation score');
        } else if (lowerCmd === '/clear') {
            terminalOutput.innerHTML = '';
        } else if (lowerCmd === '/trace') {
            printTerminalLine(`CURRENT DECK LATENCY: ${state.traceLevel}% TRACE INTENSITY`, 'text-orange');
        } else if (lowerCmd === '/ping') {
            printTerminalLine('PINGING CHIBA_U_09 PROXIES...', 'text-dim');
            setTimeout(() => printTerminalLine('REPLY FROM 104.22.41.9: TIME=12ms TTL=64', 'text-green'), 400);
            setTimeout(() => printTerminalLine('REPLY FROM 104.22.41.10: TIME=15ms TTL=64', 'text-green'), 800);
        } else if (lowerCmd === '/rep') {
            printTerminalLine('LOCAL GRID IDENTITY STATUS: ELITE', 'text-dim');
            printTerminalLine('REP POINTS: 8,420 // GLOBAL MATRIX RANK: #249', 'text-cyan');
        } else {
            printTerminalLine(`ERR: COMPILATION EXCEPTION. UNRECOGNIZED INPUT SEQUENCE: "${cmd}"`, 'text-red');
        }
    }

    // --- FEED FILTER CONTROLS ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const filter = item.getAttribute('data-filter');
            state.activeFilter = filter;
            filterPosts(filter);
        });
    });

    function filterPosts(filter) {
        const posts = postsContainer.querySelectorAll('.post-card');
        posts.forEach(post => {
            const category = post.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                post.style.display = 'flex';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // --- POST CREATION AND BROADCAST SYSTEM ---
    submitPostBtn.addEventListener('click', () => {
        const content = postTextarea.value.trim();
        if (!content) return;

        const type = document.querySelector('input[name="post-type"]:checked').value;
        createNewPost(content, type);
        postTextarea.value = '';

        // Adding post generates trace due to uplink broadcast activity
        increaseTraceLevel(Math.floor(Math.random() * 8) + 5);
    });

    function createNewPost(content, type) {
        const post = document.createElement('article');
        post.className = `post-card ${type}-post`;
        post.setAttribute('data-category', type);

        const typeLabel = type.toUpperCase();
        let threatClass = 'threat-low';
        let threatLabel = 'THREAT: MINIMAL';

        if (type === 'intel') {
            threatClass = 'threat-high';
            threatLabel = 'THREAT: HIGH';
        } else if (type === 'jobs') {
            threatClass = 'threat-critical';
            threatLabel = 'THREAT: CRITICAL';
        }

        post.innerHTML = `
            <div class="post-meta">
                <div class="poster-info">
                    <span class="poster-avatar avatar-fixer"></span>
                    <div class="poster-details">
                        <span class="poster-name">KAY_404</span>
                        <span class="reputation-score">REP: 8,420</span>
                    </div>
                </div>
                <div class="badge-group">
                    <span class="threat-badge ${threatClass}">${threatLabel}</span>
                    <span class="timestamp">JUST NOW</span>
                </div>
            </div>
            <div class="post-content">
                <h3>SECURE_UPLINK_${Date.now().toString().slice(-4)}.DAT</h3>
                <p class="encrypted-text" data-original="${content}">
                    [HOVER TO DECRYPT PAYLOAD]
                </p>
            </div>
            <div class="post-footer">
                <button class="action-btn decrypt-trigger">DECRYPT</button>
                <button class="action-btn comment-trigger">REPLY</button>
                <button class="action-btn share-trigger">BOOST</button>
            </div>
        `;

        postsContainer.prepend(post);
        bindCardDecryption(post);

        // Apply filtering logic instantly if newly added item doesn't fit the view
        if (state.activeFilter !== 'all' && state.activeFilter !== type) {
            post.style.display = 'none';
        }

        printTerminalLine(`Secure data packet broadcasted on channel [${typeLabel}]`, 'text-green');
    }

    // --- TRACE LEVEL SYSTEM ---
    function increaseTraceLevel(amount) {
        if (state.isEmergencyActive) return;

        state.traceLevel = Math.min(state.traceLevel + amount, state.maxTrace);
        traceBar.style.width = `${state.traceLevel}%`;
        traceVal.innerText = `${state.traceLevel}%`;

        if (state.traceLevel >= state.maxTrace) {
            triggerEmergencyLockdown();
        } else if (state.traceLevel > 70) {
            traceBar.style.backgroundColor = 'var(--neon-red)';
            printTerminalLine('WARNING: HIGH HOSTILE TRACE DETECTION DETECTED', 'text-red');
        }
    }

    function triggerEmergencyLockdown() {
        state.isEmergencyActive = true;
        alarmOverlay.classList.remove('hidden');
        printTerminalLine('CRITICAL: CONNECTION COMPROMISED. HOSTILE ICE ENGAGED.', 'text-red');

        // Start simulating system trace lock progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 2;
            rerouteProgress.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(progressInterval);
                if (state.isEmergencyActive) {
                    // Fail state: terminal wipe simulation
                    printTerminalLine('CRITICAL FAILURE: ENCRYPTION CORES COMPROMISED. FORCED TERMINAL DISCONNECT.', 'text-red');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        }, 150);

        state.activeInterval = progressInterval;
    }

    purgeBtn.addEventListener('click', () => {
        clearInterval(state.activeInterval);
        state.isEmergencyActive = false;
        state.traceLevel = 5;
        traceBar.style.width = `${state.traceLevel}%`;
        traceVal.innerText = `${state.traceLevel}%`;
        traceBar.style.backgroundColor = 'var(--neon-red)';
        alarmOverlay.classList.add('hidden');
        printTerminalLine('SYSTEM PURGE COMPLETED. PROXIES RESET TO SAFE HOPS.', 'text-green');
    });

    // --- AMBIENT/BACKGROUND TICKER SIMULATOR ---
    setInterval(() => {
        const tickers = document.querySelectorAll('.ticker-item');
        const targetTicker = tickers[Math.floor(Math.random() * tickers.length)];
        const priceSpan = targetTicker.querySelector('.ticker-price');
        
        let currentPriceStr = priceSpan.innerText.replace(/[^0-9]/g, '');
        let currentPrice = parseInt(currentPriceStr);
        
        const changePercent = (Math.random() * 8 - 4) / 100;
        const newPrice = Math.round(currentPrice * (1 + changePercent));

        const isUp = changePercent >= 0;
        priceSpan.className = `ticker-price ${isUp ? 'text-green' : 'text-red'}`;
        priceSpan.innerText = `${isUp ? '▲' : '▼'} ${newPrice.toLocaleString()} ℮`;
    }, 4000);
});
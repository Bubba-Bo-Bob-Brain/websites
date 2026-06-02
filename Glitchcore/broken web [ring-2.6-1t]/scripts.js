// ═══════════════════════════════════════════════════════════════
// DEAD WEB ARCHIVE — Interactive Art Experience
// scripts.js
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ═══════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════

    const state = {
        currentScreen: 'screen-gate',
        fragments: [],
        maxFragments: 4,
        commandsEntered: 0,
        pagesTraversed: new Set(['screen-gate']),
        terminalHistory: [],
        audioEnabled: false,
        bsodTriggered: false,
        loadingComplete: false,
        web1CardsExplored: 0,
        secretFound: false,
        glitchInterval: null,
        rainDrops: [],
        whisperMessages: [
            '"Do you remember when the internet felt infinite?"',
            '"The servers are cold now. But something still runs."',
            '"Behind every 404, a story was deleted."',
            '"Look closer. The code wants to tell you something."',
            '"You are not the first. You might be the last."',
            '"The labyrinth remembers those who wander."',
            '"01000100 01001111 01001111 01001101" ...',
            '"The heart of the web still beats."',
            '"What is a page that no one visits?"',
            '"We are the archivists of the abandoned."',
        ],
        whisperIndex: 0,
        loadingLogEntries: [
            'Booting legacy systems...',
            'Scanning dead domains...',
            'Connecting to GeoCities relay...',
            'Handshake failed. Retrying...',
            'Found fragment of corrupted index...',
            'Decoding legacy HTML 2.0 markup...',
            'WARNING: Memory leak detected in archive.dll',
            'Attempting TCP/IP resurrection...',
            'Found 14,327 orphaned hyperlinks',
            'Parsing cascading stylesheets... ERROR',
            'Recovering guestbook entries...',
            'Decrypting forgotten protocols...',
            'Loading marquee module...',
            'Initializing visitor counter daemon...',
            'SYSTEM READY (or is it?)',
        ],
        terminalCommands: {
            help: {
                description: 'Display available commands',
                output: [
                    '<span class="terminal-cmd">Available commands:</span>',
                    '',
                    '  <span class="terminal-cmd">help</span>       — Show this help message',
                    '  <span class="terminal-cmd">ls</span>         — List archive directories',
                    '  <span class="terminal-cmd">cat [file]</span>  — Read a file from the archive',
                    '  <span class="terminal-cmd">explore</span>    — Search the deep archive',
                    '  <span class="terminal-cmd">decrypt</span>     — Decrypt recovered fragments',
                    '  <span class="terminal-cmd">dig</span>        — Dig through server layers',
                    '  <span class="terminal-cmd">whoami</span>     — Query your digital identity',
                    '  <span class="terminal-cmd">status</span>     — Check system status',
                    '  <span class="terminal-cmd">remember</span>   — Attempt to recall the original web',
                    '  <span class="terminal-cmd">clear</span>      — Clear terminal output',
                    '  <span class="terminal-cmd">exit</span>       — Close terminal session',
                    '',
                    '<span style="color: #ff8c00">⚠ Some commands may have irreversible effects.</span>',
                ],
            },
            ls: {
                description: 'List archive directories',
                output: [
                    '<span class="terminal-cmd">/archive/</span>',
                    '  ├── /archive/lost_pages/',
                    '  │   ├── index.html          [CORRUPTED]',
                    '  │   ├── about.html          [DELETED]',
                    '  │   ├── guestbook.txt       [404]',
                    '  │   └── images/',
                    '  │       ├── logo.gif         [BROKEN LINK]',
                    '  │       └── banner.jpg       [TRUNCATED]',
                    '  ├── /archive/messages/',
                    '  │   ├── hello_world.txt     [READ-ONLY]',
                    '  │   └── final_transmission.dat [ENCRYPTED]',
                    '  ├── /archive/secrets/',
                    '  │   └── .hidden',
                    '  │       └── heart.html       [PASSWORD PROTECTED]',
                    '  └── /archive/logs/',
                    '      └── system.log          [4.7TB — PARTIALLY RECOVERED]',
                ],
            },
            'cat': {
                description: 'Read a file — usage: cat [filename]',
                output: null, // Dynamic
            },
            'cat index.html': {
                description: 'Read corrupted index',
                output: [
                    '<span style="color: #00cc33">&lt;!DOCTYPE html&gt;</span>',
                    '<span style="color: #00cc33">&lt;html&gt;</span>',
                    '<span style="color: #00cc33">&lt;head&gt;</span>',
                    '  <span style="color: #009999">&lt;title&gt;</span>The Future Web<span style="color: #009999">&lt;/title&gt;</span>',
                    '<span style="color: #00cc33">&lt;/head&gt;</span>',
                    '<span style="color: #00cc33">&lt;body&gt;</span>',
                    '  <span style="color: #bf40ff">&lt;h1&gt;</span>Welcome to Tomorrow<span style="color: #bf40ff">&lt;/h1&gt;</span>',
                    '  <span style="color: #009999">&lt;marquee&gt;</span>THE FUTURE IS NOW<span style="color: #009999">&lt;/marquee&gt;</span>',
                    '  <span style="color: #ff8c00">&lt;blink&gt;</span>UNDER CONSTRUCTION<span style="color: #ff8c00">&lt;/blink&gt;</span>',
                    '  <span style="color: #ff0040">&lt;!-- THIS PAGE NO LONGER EXISTS --&gt;</span>',
                    '<span style="color: #00cc33">&lt;/body&gt;</span>',
                    '<span style="color: #00cc33">&lt;/html&gt;</span>',
                    '',
                    '<span style="color: #ff0040">ERROR: File truncated at line 11. 67% recovered.</span>',
                ],
            },
            'cat final_transmission.dat': {
                description: 'Read final transmission',
                output: [
                    '<span style="color: #ffff00">[DECRYPTED TRANSMISSION — ORIGIN: 1999-12-31]</span>',
                    '',
                    'Subject: Goodbye and Good Luck',
                    'From: admin@web1.archive',
                    'To: Whoever Finds This',
                    '',
                    'If you are reading this, the servers have finally fallen silent.',
                    'We poured our lives into these pages. They were not just code —',
                    'they were letters to the future.',
                    '',
                    'The password is: <span style="color: #00ffff; font-weight: bold">MEMORY</span>',
                    '',
                    '<span style="color: #ff0040">⚠ WARNING: After this message, the archive will purge.</span>',
                    '<span style="color: #ff0040">⚠ The labyrinth has a heart. Find it before it is too late.</span>',
                    '',
                    '<span style="color: #00cc33">— The Webmasters</span>',
                ],
            },
            explore: {
                description: 'Search the deep archive',
                output: [
                    '<span class="terminal-output">Searching deep archive...</span>',
                    '<span class="terminal-output">Scanning 14,327 dead domains...</span>',
                    '<span class="terminal-output">Found fragments in the static:</span>',
                    '',
                    '  <span style="color: #00ffff">▸ Fragment 1:</span> "The web was meant to be permanent."',
                    '  <span style="color: #00ffff">▸ Fragment 2:</span> "Every link is a promise."',
                    '  <span style="color: #00ffff">▸ Fragment 3:</span> "Servers forget. Archives remember."',
                    '  <span style="color: #00ffff">▸ Fragment 4:</span> "The heart is where you left it."',
                    '',
                    '<span style="color: #ffff00">▸ Deep signal detected:</span> Use <span class="terminal-cmd">dig</span> to go deeper.',
                    '<span style="color: #ffff00">▸ Encrypted file found:</span> Use <span class="terminal-cmd">cat final_transmission.dat</span>',
                ],
            },
            decrypt: {
                description: 'Decrypt recovered fragments',
                output: [
                    '<span class="terminal-output">Initializing decryption engine...</span>',
                    '<span class="terminal-output">Applying ROT-47 cipher...</span>',
                    '<span class="terminal-output">Cross-referencing with dead keyservers...</span>',
                    '',
                    '<span style="color: #00ffff">▸ Decrypted message:</span>',
                    '',
                    '  <span style="color: #bf40ff">████ ████ ████ ████</span>',
                    '  <span style="color: #bf40ff">██   ██ █ ████ █  █</span>',
                    '  <span style="color: #bf40ff">████ ████ ████ ████</span>',
                    '  <span style="color: #bf40ff">█  █ █ █ ████ █ █</span>',
                    '  <span style="color: #bf40ff">████ ████ ████ █  █</span>',
                    '',
                    '<span style="color: #ff8c00">▸ Translation:</span> "REMEMBER"',
                    '',
                    '<span style="terminal-output">Try: <span class="terminal-cmd">remember</span></span>',
                ],
            },
            dig: {
                description: 'Dig through server layers',
                output: [
                    '<span class="terminal-output">Digging through server layers...</span>',
                    '<span class="terminal-output">Layer 1: HTML 1.0 — collapsed</span>',
                    '<span class="terminal-output">Layer 2: CSS 1.0 — degraded</span>',
                    '<span class="terminal-output">Layer 3: JavaScript 1.0 — frozen</span>',
                    '<span class="terminal-output">Layer 4: Flash content — GONE</span>',
                    '<span class="terminal-output">Layer 5: Applets — VOID</span>',
                    '<span class="terminal-output">Layer 6: CGI-BIN — sealed</span>',
                    '<span style="color: #ffff00">▸ Layer 7: Something is pulsing...</span>',
                    '<span style="color: #ffff00">▸ A password is required.</span>',
                    '<span style="color: #ff8c00">▸ Hint: What did the archivists leave behind?</span>',
                    '<span style="color: #ff8c00">▸ Try: <span class="terminal-cmd">remember</span></span>',
                ],
            },
            whoami: {
                description: 'Query digital identity',
                output: [
                    '<span class="terminal-output">Querying identity server...</span>',
                    '<span class="terminal-output">No match in /etc/passwd</span>',
                    '<span class="terminal-output">Searching shadow database...</span>',
                    '<span style="color: #ff8c00">▸ Identity: <span style="color: #00ffff">visitor_null</span></span>',
                    '<span style="color: #ff8c00">▸ Status: <span style="color: #ff0040">UNVERIFIED</span></span>',
                    '<span style="color: #ff8c00">▸ Access Level: <span style="color: #00ff41">DEEP</span></span>',
                    '<span style="color: #ff8c00">▸ Origin: <span style="color: #bf40ff">The Labyrinth</span></span>',
                    '',
                    '<span class="terminal-output">You are the last visitor.</span>',
                    '<span class="terminal-output">Or the first. Time is broken here.</span>',
                ],
            },
            status: {
                description: 'Check system status',
                output: null, // Dynamic
            },
            clear: {
                description: 'Clear terminal',
                output: null, // Handled specially
            },
            exit: {
                description: 'Close terminal session',
                output: null, // Handled specially
            },
            remember: {
                description: 'Recall the original web',
                output: null, // Handled specially - triggers heart reveal
            },
        },
    };

    // ═══════════════════════════════════════════════
    // DOM REFERENCES
    // ═══════════════════════════════════════════════

    const screens = document.querySelectorAll('.screen');
    const customCursor = document.getElementById('custom-cursor');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const progressFill = document.getElementById('progress-fill');
    const progressGlitch = document.getElementById('progress-glitch');
    const progressPercent = document.getElementById('progress-percent');
    const loadingStatus = document.getElementById('loading-status');
    const loadingLog = document.getElementById('loading-log');
    const loadingHidden = document.getElementById('loading-hidden');
    const whisperText = document.getElementById('whisper-text');
    const rainContainer = document.getElementById('rain');
    const fragmentSlots = document.getElementById('fragment-slots');
    const fragmentCount = document.getElementById('fragment-count');
    const hiddenDatalink = document.getElementById('hidden-datalink');
    const audioIndicator = document.getElementById('audio-indicator');
    const audioIcon = document.getElementById('audio-icon');
    const heartParticles = document.getElementById('heart-particles');
    const heartReveal = document.getElementById('heart-reveal');
    const bsodScreen = document.getElementById('bsod-screen');
    const bsodProgress = document.getElementById('bsod-progress');
    const bsodProgressFill = document.getElementById('bsod-progress-fill');
    const error404 = document.getElementById('error-404');
    const pageHits = document.getElementById('page-hits');
    const onlineCount = document.getElementById('online-count');
    const archiveDate = document.getElementById('archive-date');

    // ═══════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════

    function init() {
        setupCursor();
        setupWhispers();
        createRain();
        setupLoadingBar();
        setupTerminal();
        setupFragmentInteraction();
        setupWeb1Cards();
        setupSecretLink();
        setupRetryButton();
        animateVisitorCounter();
        setArchiveDate();
        startRandomGlitches();
        startLoadingSequence();
    }

    // ═══════════════════════════════════════════════
    // CUSTOM CURSOR
    // ═══════════════════════════════════════════════

    function setupCursor() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            customCursor.style.left = cursorX + 'px';
            customCursor.style.top = cursorY + 'px';
            rafId = requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('button, a, [onclick], .clickable-row, .web1-card').forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hovering'));
        });

        document.addEventListener('mousedown', () => customCursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => customCursor.classList.remove('clicking'));

        // Hide cursor when typing in terminal
        terminalInput.addEventListener('focus', () => customCursor.classList.add('hidden'));
        terminalInput.addEventListener('blur', () => customCursor.classList.remove('hidden'));
    }

    // ═══════════════════════════════════════════════
    // WHISPER TEXT CYCLING
    // ═══════════════════════════════════════════════

    function setupWhispers() {
        whisperText.textContent = state.whisperMessages[0];
        setInterval(() => {
            state.whisperIndex = (state.whisperIndex + 1) % state.whisperMessages.length;
            whisperText.style.opacity = 0;
            whisperText.style.transform = 'translateY(5px)';
            setTimeout(() => {
                whisperText.textContent = state.whisperMessages[state.whisperIndex];
                whisperText.style.opacity = 1;
                whisperText.style.transform = 'translateY(0)';
            }, 500);
        }, 6000);
    }

    // ═══════════════════════════════════════════════
    // RAIN EFFECT
    // ═══════════════════════════════════════════════

    function createRain() {
        const dropCount = 60;
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.height = (Math.random() * 20 + 10) + 'px';
            drop.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            drop.style.animationDelay = (Math.random() * 5) + 's';
            drop.style.opacity = Math.random() * 0.2 + 0.05;
            rainContainer.appendChild(drop);
        }
    }

    // ═══════════════════════════════════════════════
    // SCREEN NAVIGATION
    // ═══════════════════════════════════════════════

    function showScreen(screenId) {
        const prevScreen = document.querySelector('.screen.active');
        const nextScreen = document.getElementById(screenId);
        if (!nextScreen || screenId === state.currentScreen) return;

        state.pagesTraversed.add(screenId);
        state.currentScreen = screenId;

        // Exit animation
        if (prevScreen) {
            prevScreen.classList.add('screen-exit');
            prevScreen.classList.remove('active');
            setTimeout(() => {
                prevScreen.classList.remove('screen-exit');
                prevScreen.style.display = 'none';
            }, 800);
        }

        // Enter animation
        nextScreen.style.display = 'block';
        // Force reflow
        void nextScreen.offsetWidth;
        nextScreen.classList.add('active');

        // Trigger screen-specific effects
        if (screenId === 'screen-loading') {
            startLoadingAnimation();
        }
        if (screenId === 'screen-terminal') {
            setTimeout(() => terminalInput.focus(), 500);
        }
        if (screenId === 'screen-heart') {
            triggerHeartReveal();
        }
        if (screenId === 'screen-database') {
            createRain();
        }

        // Screen-specific cursor
        if (screenId === 'screen-terminal') {
            customCursor.classList.add('hidden');
        } else {
            customCursor.classList.remove('hidden');
        }

        // Trigger glitch on transition
        triggerScreenGlitch();
    }

    function triggerScreenGlitch() {
        document.body.style.animation = 'none';
        void document.body.offsetWidth;
        const glitch = document.createElement('div');
        glitch.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0,255,65,0.03) 0px,
                rgba(0,255,65,0.03) 1px,
                transparent 1px,
                transparent 3px
            );
            z-index: 10000;
            pointer-events: none;
            animation: glitch-shake 0.15s ease-out;
        `;
        document.body.appendChild(glitch);
        setTimeout(() => glitch.remove(), 200);
    }

    // ═══════════════════════════════════════════════
    // LOADING SCREEN
    // ═══════════════════════════════════════════════

    function startLoadingSequence() {
        // Start after a delay on the gate screen
        setTimeout(() => {
            if (state.currentScreen === 'screen-gate') return; // User already navigated
        }, 5000);
    }

    function setupLoadingBar() {
        const progressBar = document.querySelector('.progress-bar');

        progressBar.addEventListener('click', () => {
            if (state.loadingComplete) return;

            // Clicking the bar causes chaos
            progressFill.style.transition = 'width 0.1s';
            let fakeProgress = parseInt(progressFill.style.width) || 0;
            fakeProgress += Math.random() * 30 + 10;

            if (fakeProgress > 100) {
                // GLITCH: over 100%
                progressFill.style.width = '100%';
                progressFill.style.background = 'linear-gradient(90deg, #ff0040, #ff8c00, #ffff00)';
                progressPercent.textContent = 'ERR_' + Math.floor(Math.random() * 999);
                loadingStatus.textContent = 'FATAL: Progress exceeded acceptable reality. System corrupting...';
                addLogEntry('ERROR: Progress overflow detected!', 'error');

                setTimeout(() => {
                    triggerBSOD();
                }, 1500);

                setTimeout(() => {
                    bsodScreen.classList.remove('active');
                    bsodScreen.style.display = 'none';
                    resetLoading();
                }, 5000);
            } else {
                progressFill.style.width = fakeProgress + '%';
                progressPercent.textContent = Math.floor(fakeProgress) + '%';
                loadingStatus.textContent = loadingLogEntries[
                    Math.floor(Math.random() * loadingLogEntries.length)
                ];
                addLogEntry(loadingStatus.textContent);
            }
        });
    }

    function startLoadingAnimation() {
        state.loadingComplete = false;
        progressFill.style.transition = 'width 3s ease-in-out';
        progressFill.style.background = 'linear-gradient(90deg, var(--neon-green-dark), var(--neon-green))';

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 97) {
                clearInterval(interval);

                // Fake almost-done stalling
                addLogEntry('WARNING: Finalizing... connection unstable.', 'warn');
                loadingStatus.textContent = 'Almost there... but what is "there"?';

                setTimeout(() => {
                    progressFill.style.width = '97%';
                    progressPercent.textContent = '97%';

                    addLogEntry('SYSTEM: Stuck at 97%. This is fine. Everything is fine.', 'error');
                    loadingStatus.textContent = 'Corrupting the loading bar for realism...';

                    setTimeout(() => {
                        progressFill.style.width = '100%';
                        progressPercent.textContent = '100%';
                        loadingStatus.textContent = 'COMPLETE. Or is it?';
                        addLogEntry('Loading complete. (Don\'t believe it.)', 'success');
                        state.loadingComplete = true;

                        setTimeout(() => {
                            showScreen('screen-database');
                        }, 2000);
                    }, 2000);
                }, 2500);
            } else {
                progressFill.style.width = progress + '%';
                progressPercent.textContent = Math.floor(progress) + '%';

                const statuses = [
                    'Establishing connection to forgotten servers...',
                    'Decrypting ancient JavaScript files...',
                    'Loading deprecated CSS...',
                    'Resolving dead DNS entries...',
                    'Contacting the Wayback Machine...',
                    'Buffering the void...',
                    'Parsing broken HTML...',
                    'Recalling deleted memories...',
                    'Scanning for ghosts in the machine...',
                    'Negotiating with 404 spirits...',
                ];
                loadingStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
                addLogEntry(loadingStatus.textContent);
            }
        }, 800);
    }

    function resetLoading() {
        progressFill.style.transition = 'width 0.5s';
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressFill.style.background = 'linear-gradient(90deg, var(--neon-green-dark), var(--neon-green))';
        loadingLog.innerHTML = '<div class="log-entry"><span class="log-time">00:00:00</span> <span class="log-text">System rebooted. Try again?</span></div>';
        loadingStatus.textContent = 'Establishing connection to forgotten servers...';
        state.loadingComplete = false;
        loadingHidden.style.opacity = '0';
    }

    function addLogEntry(text, type = 'normal') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date();
        const timeStr = time.toTimeString().split(' ')[0];
        let color = 'var(--text-dim)';
        if (type === 'error') color = 'var(--neon-red)';
        if (type === 'warn') color = 'var(--neon-amber)';
        if (type === 'success') color = 'var(--neon-green)';

        entry.innerHTML = `<span class="log-time" style="color: ${color}">${timeStr}</span> <span class="log-text">${text}</span>`;
        loadingLog.appendChild(entry);
        loadingLog.scrollTop = loadingLog.scrollHeight;
    }

    // ═══════════════════════════════════════════════
    // BSOD
    // ═══════════════════════════════════════════════

    function triggerBSOD() {
        bsodScreen.style.display = 'flex';
        void bsodScreen.offsetWidth;
        bsodScreen.classList.add('active');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            bsodProgress.textContent = Math.floor(progress);
            bsodProgressFill.style.width = progress + '%';
        }, 200);
    }

    function setupRetryButton() {
        // The "Retry Connection" button triggers BSOD then returns
        // This is handled via the glitchButton function called from onclick
    }

    window.glitchButton = function(btn) {
        btn.innerHTML = '<span>⟳</span> R<span style="color:#ff0040">E</span><span style="color:#ffff00">T</span><span style="color:#00ff41">R</span><span style="color:#00ffff">Y</span><span style="color:#ff00ff">I</span><span style="color:#bf40ff">N</span><span style="color:#ff8c00">G</span>...';
        btn.style.borderColor = '#ff0040';
        btn.style.color = '#ff0040';

        triggerBSOD();

        setTimeout(() => {
            bsodScreen.classList.remove('active');
            bsodScreen.style.display = 'none';
            btn.innerHTML = '<span>⟳</span> Retry Connection';
            btn.style.borderColor = '';
            btn.style.color = '';

            // Trigger a screen glitch effect
            document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
            setTimeout(() => { document.body.style.filter = ''; }, 300);
        }, 4000);
    };

    // ═══════════════════════════════════════════════
    // FRAGMENT SYSTEM (Database Screen)
    // ═══════════════════════════════════════════════

    function setupFragmentInteraction() {
        const rows = document.querySelectorAll('.clickable-row');
        const fragmentMap = {
            user1: { slot: 1, symbol: '👻', text: 'ghost_1997: "I existed."' },
            user2: { slot: 2, symbol: '🌀', text: 'neon_pilgrim: "I searched for meaning."' },
            user3: { slot: 3, symbol: '◈', text: 'archivist_null: "I tried to save everything."' },
            user4: { slot: 4, symbol: '💀', text: 'last_survivor: "I am the last link."' },
            msg1: { slot: 1, symbol: '👻', text: 'ghost_1997: "Do you remember?"' },
            msg2: { slot: 2, symbol: '🌀', text: 'neon_pilgrim: "I found something behind the last door."' },
            msg4: { slot: 3, symbol: '◈', text: 'last_survivor: "The labyrinth is not broken."' },
            msg3: { slot: 4, symbol: '💀', text: 'archivist_null: "[REDACTED — TOO DANGEROUS]"' },
        };

        rows.forEach(row => {
            row.addEventListener('click', () => {
                const id = row.id ? row.id : row.closest('table').id + '-' + row.rowIndex;

                // Determine which fragment based on the row
                let fragKey = null;
                if (row.id === 'user1' || (row.cells[1] && row.cells[1].textContent.includes('ghost_1997'))) fragKey = 'user1';
                else if (row.id === 'user2' || (row.cells[1] && row.cells[1].textContent.includes('neon_pilgrim'))) fragKey = 'user2';
                else if (row.id === 'user3' || (row.cells[1] && row.cells[1].textContent.includes('archivist_null'))) fragKey = 'user3';
                else if (row.id === 'user4' || (row.cells[1] && row.cells[1].textContent.includes('last_survivor'))) fragKey = 'user4';
                else if (row.cells[2] && row.cells[2].textContent.includes('ghost_1997')) fragKey = 'msg1';
                else if (row.cells[2] && row.cells[2].textContent.includes('neon_pilgrim')) fragKey = 'msg2';
                else if (row.cells[2] && row.cells[2].textContent.includes('archivist_null')) fragKey = 'msg3';
                else if (row.cells[2] && row.cells[2].textContent.includes('last_survivor')) fragKey = 'msg4';

                if (!fragKey) return;

                const frag = fragmentMap[fragKey];
                const slot = frag.slot;

                // Don't re-add
                if (state.fragments.includes(fragKey)) {
                    showFragmentNotification('Fragment already recovered.');
                    return;
                }

                state.fragments.push(fragKey);

                // Animate the row
                row.style.background = 'rgba(0, 255, 65, 0.15)';
                row.style.transition = 'background 0.5s';
                setTimeout(() => { row.style.background = ''; }, 1000);

                // Update fragment slot
                const slotEl = document.getElementById('slot-' + slot);
                slotEl.classList.add('filled');
                slotEl.innerHTML = `<span>${frag.symbol}</span>`;

                // Update count
                fragmentCount.textContent = state.fragments.length;

                showFragmentNotification(`Fragment ${state.fragments.length}/${state.maxFragments} recovered: ${frag.text}`);

                // Check if all fragments collected
                if (state.fragments.length >= state.maxFragments) {
                    setTimeout(() => {
                        showFragmentNotification('ALL FRAGMENTS RECOVERED. The path to the Terminal is open.');
                        hiddenDatalink.style.opacity = '1';
                        hiddenDatalink.style.transform = 'translateY(0)';
                        hiddenDatalink.style.pointerEvents = 'all';
                        hiddenDatalink.style.animation = 'fragment-glow 2s ease-in-out infinite';
                    }, 500);
                }
            });
        });
    }

    function showFragmentNotification(msg) {
        const existing = document.getElementById('fragment-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.id = 'fragment-notification';
        notif.style.cssText = `
            position: fixed; top: 60px; right: 20px; z-index: 10000;
            background: rgba(10, 10, 16, 0.95); border: 1px solid var(--neon-green);
            color: var(--neon-green); font-family: 'VT323', monospace;
            font-size: 0.9rem; padding: 1rem 1.5rem;
            box-shadow: 0 0 20px rgba(0,255,65,0.2);
            max-width: 350px; animation: terminal-fade 0.5s ease-out;
            pointer-events: none;
        `;
        notif.textContent = '> ' + msg;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(20px)';
            notif.style.transition = 'all 0.5s';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }

    // ═══════════════════════════════════════════════
    // WEB 1.0 CARDS
    // ═══════════════════════════════════════════════

    function setupWeb1Cards() {
        const cards = document.querySelectorAll('.web1-card');
        const messages = [
            'You found something! But it dissolved in your hands.',
            'The card shimmers... then returns to static.',
            'A ghost of a webpage. You can almost remember it.',
            'Data fragment recovered. +1 Memory.',
            'This card was last updated in 1998.',
            'The content shifts and rearranges itself...',
            'You feel a strange sense of digital déjà vu.',
            'ERROR: Nostalgia buffer overflow.',
        ];

        cards.forEach((card, idx) => {
            card.addEventListener('click', () => {
                state.web1CardsExplored++;

                // Visual feedback
                card.style.borderColor = 'var(--neon-cyan)';
                card.style.boxShadow = '0 0 30px rgba(0,255,255,0.15), inset 0 0 30px rgba(0,255,255,0.05)';
                setTimeout(() => {
                    card.style.borderColor = '';
                    card.style.boxShadow = '';
                }, 2000);

                // Show notification
                showFragmentNotification(messages[idx % messages.length]);

                if (state.web1CardsExplored >= 4 && !state.secretFound) {
                    state.secretFound = true;
                    setTimeout(() => {
                        showFragmentNotification('SECRET UNLOCKED: The hidden link in the LINKS card has awakened.');
                    }, 1000);
                }
            });
        });
    }

    // ═══════════════════════════════════════════════
    // SECRET LINK (Web 1.0 screen)
    // ═══════════════════════════════════════════════

    function setupSecretLink() {
        const secretLink = document.getElementById('secret-web1-link');

        secretLink.addEventListener('mouseenter', () => {
            secretLink.style.color = 'var(--neon-magenta)';
            secretLink.style.textShadow = '0 0 20px rgba(255,0,255,0.7)';
            secretLink.style.fontSize = '1rem';
            secretLink.style.height = 'auto';
            secretLink.textContent = '★ THE DOOR WITHIN ★';
        });

        secretLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Reveal the hidden datalink if fragments are complete
            if (state.fragments.length >= state.maxFragments) {
                showFragmentNotification('You already have the key. Go to the Terminal.');
            } else {
                showFragmentNotification('The door resists. Something is missing... Collect the fragments.');
            }
        });
    }

    // ═══════════════════════════════════════════════
    // TERMINAL
    // ═══════════════════════════════════════════════

    function setupTerminal() {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';
                processCommand(cmd);
            }
        });

        // Click anywhere on terminal to focus input
        document.querySelector('.terminal-wrapper').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    function processCommand(cmd) {
        if (!cmd) return;

        state.commandsEntered++;

        // Add user input to terminal
        addTerminalLine(`<span class="terminal-prompt">root@deadwebarchive: ~#</span> <span style="color: white">${escapeHtml(cmd)}</span>`, false);

        // Process command
        if (cmd === 'help') {
            executeHelp();
        } else if (cmd === 'ls') {
            executeLs();
        } else if (cmd.startsWith('cat ')) {
            const filename = cmd.substring(4).trim();
            executeCat(filename);
        } else if (cmd === 'explore') {
            executeExplore();
        } else if (cmd === 'decrypt') {
            executeDecrypt();
        } else if (cmd === 'dig') {
            executeDig();
        } else if (cmd === 'whoami') {
            executeWhoami();
        } else if (cmd === 'status') {
            executeStatus();
        } else if (cmd === 'clear') {
            terminalBody.innerHTML = '';
        } else if (cmd === 'remember') {
            executeRemember();
        } else if (cmd === 'exit') {
            addTerminalLine('<span class="terminal-output">logout</span>', false);
            addTerminalLine('<span class="terminal-output">Connection to deadwebarchive closed.</span>', false);
            setTimeout(() => showScreen('screen-gate'), 1500);
        } else if (cmd === 'jump' || cmd === 'heart' || cmd === 'portal') {
            // Easter egg - jump straight to heart
            addTerminalLine('<span style="color: #00ff41">▸ INITIATING EMERGENCY TRANSFER...</span>', false);
            addTerminalLine('<span style="color: #00ff41">▸ LOCATING THE HEART OF THE WEB...</span>', false);
            setTimeout(() => showScreen('screen-heart'), 2000);
        } else if (cmd === 'matrix' || cmd === 'rain') {
            // Easter egg - visual effect
            triggerMatrixRain();
        } else if (cmd === 'bsod') {
            triggerBSOD();
            setTimeout(() => {
                bsodScreen.classList.remove('active');
                bsodScreen.style.display = 'none';
            }, 4000);
        } else {
            // Unknown command
            const errors = [
                `command not found: ${escapeHtml(cmd)}`,
                `bash: ${escapeHtml(cmd)}: permission denied`,
                `ERROR 404: Command '${escapeHtml(cmd)}' not found in the dead web`,
                `FATAL: '${escapeHtml(cmd)}' is not recognized as an internal or external command`,
                `The command "${escapeHtml(cmd)}" has been deleted from the server`,
                `SEGMENTATION FAULT: The command shattered into fragments`,
            ];
            addTerminalLine(`<span style="color: var(--neon-red)">${errors[Math.floor(Math.random() * errors.length)]}</span>`, false);
        }
    }

    function executeHelp() {
        const lines = state.terminalCommands.help.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 80);
        });
    }

    function executeLs() {
        const lines = state.terminalCommands.ls.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 100);
        });
    }

    function executeCat(filename) {
        const cmdKey = 'cat ' + filename;
        if (state.terminalCommands[cmdKey]) {
            const lines = state.terminalCommands[cmdKey].output;
            if (lines) {
                lines.forEach((line, i) => {
                    setTimeout(() => {
                        addTerminalLine(line, true);
                    }, i * 60);
                });
            }
        } else {
            addTerminalLine(`<span style="color: var(--neon-red)">cat: ${escapeHtml(filename)}: No such file or directory</span>`, false);
            addTerminalLine(`<span style="color: var(--text-dim)">Available files: index.html, final_transmission.dat</span>`, false);
        }
    }

    function executeExplore() {
        const lines = state.terminalCommands.explore.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 120);
        });
    }

    function executeDecrypt() {
        const lines = state.terminalCommands.decrypt.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 100);
        });
    }

    function executeDig() {
        const lines = state.terminalCommands.dig.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 150);
        });
    }

    function executeWhoami() {
        const lines = state.terminalCommands.whoami.output;
        lines.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 100);
        });
    }

    function executeStatus() {
        const fragStatus = state.fragments.length >= state.maxFragments ? '█ COMPLETE' : `█ ${state.fragments.length}/${state.maxFragments}`;
        const outputs = [
            `<span style="color: var(--neon-green)">═══════════════════════════════</span>`,
            `<span style="color: var(--neon-cyan)">SYSTEM STATUS REPORT</span>`,
            `<span style="color: var(--neon-green)">═══════════════════════════════</span>`,
            ``,
            `  Uptime:        ${Math.floor(Math.random() * 9999)} days, ${Math.floor(Math.random() * 23)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
            `  Memory:        ${(Math.random() * 2 + 0.5).toFixed(1)} / 640 KB`,
            `  Fragments:     ${fragStatus}`,
            `  Pages visited: ${state.pagesTraversed.size}`,
            `  Commands run:  ${state.commandsEntered}`,
            `  Connections:   ${Math.floor(Math.random() * 3)} active`,
            ``,
            `<span style="color: var(--neon-amber)">  ⚠ Archive integrity: ${Math.floor(Math.random() * 30 + 70)}%</span>`,
            `<span style="color: var(--neon-red)">  ✗ Data loss: ${Math.floor(Math.random() * 40 + 10)}%</span>`,
            ``,
            `<span style="color: var(--text-dim)">  The system remembers what it chooses to.</span>`,
        ];
        outputs.forEach((line, i) => {
            setTimeout(() => {
                addTerminalLine(line, true);
            }, i * 50);
        });
    }

    function executeRemember() {
        addTerminalLine('', false);
        addTerminalLine('<span style="color: var(--neon-amber)">▸ INITIATING REMEMBRANCE PROTOCOL...</span>', false);
        addTerminalLine('<span style="color: var(--text-dim)">Searching for the original web...</span>', false);

        setTimeout(() => {
            addTerminalLine('<span style="color: var(--text-dim)">Finding the pages that once were...</span>', false);
            addTerminalLine('<span style="color: var(--neon-cyan)">▸ Fragment 1: "The web was meant to be permanent."</span>', false);
            addTerminalLine('<span style="color: var(--neon-cyan)">▸ Fragment 2: "Every link is a promise."</span>', false);
            addTerminalLine('<span style="color: var(--neon-cyan)">▸ Fragment 3: "Servers forget. Archives remember."</span>', false);
            addTerminalLine('<span style="color: var(--neon-cyan)">▸ Fragment 4: "The heart is where you left it."</span>', false);
        }, 1000);

        setTimeout(() => {
            addTerminalLine('', false);
            if (state.fragments.length >= state.maxFragments) {
                addTerminalLine('<span style="color: #00ff41; font-size: 1.1em;">▸ ALL FRAGMENTS ALIGNED.</span>', false);
                addTerminalLine('<span style="color: #00ff41">▸ THE HEART OF THE WEB REVEALED.</span>', false);
                addTerminalLine('<span style="color: #00ffff">▸ TRANSFERRING...</span>', false);

                setTimeout(() => {
                    showScreen('screen-heart');
                }, 2000);
            } else {
                addTerminalLine(`<span style="color: var(--neon-red)">▸ WARNING: Only ${state.fragments.length}/${state.maxFragments} fragments recovered.</span>`, false);
                addTerminalLine('<span style="color: var(--neon-red)">▸ The heart cannot be reached without all fragments.</span>', false);
                addTerminalLine('<span style="color: var(--neon-red)">▸ Visit the Database. Recover what was lost.</span>', false);
                addTerminalLine('<span style="color: var(--text-dim)">▸ Tip: Click the data rows to recover fragments.</span>', false);
            }
        }, 3000);
    }

    function addTerminalLine(html, isOutput) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (isOutput) {
            line.innerHTML = `<span class="terminal-output">${html}</span>`;
        } else {
            line.innerHTML = html;
        }
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ═══════════════════════════════════════════════
    // VISITOR COUNTER ANIMATION
    // ═══════════════════════════════════════════════

    function animateVisitorCounter() {
        if (!pageHits) return;
        let count = 0;
        const target = 6661;
        const duration = 3000;
        const increment = target / (duration / 16);

        function tick() {
            count += increment;
            if (count >= target) {
                count = target;
                pageHits.textContent = target;
                return;
            }
            pageHits.textContent = Math.floor(count);
            requestAnimationFrame(tick);
        }

        // Delay start
        setTimeout(tick, 1000);
    }

    // ═══════════════════════════════════════════════
    // ARCHIVE DATE
    // ═══════════════════════════════════════════════

    function setArchiveDate() {
        if (archiveDate) {
            archiveDate.textContent = 'December 31, 1999';
        }
    }

    // ═══════════════════════════════════════════════
    // STATS COUNTER (Heart Screen)
    // ═══════════════════════════════════════════════

    function animateStats() {
        const statPages = document.getElementById('stat-pages');
        const statFragments = document.getElementById('stat-fragments');
        const statCommands = document.getElementById('stat-commands');

        if (!statPages || !statFragments || !statCommands) return;

        animateNumber(statPages, 0, state.pagesTraversed.size, 1500);
        animateNumber(statFragments, 0, state.fragments.length, 1500);
        animateNumber(statCommands, 0, state.commandsEntered, 1500);
    }

    function animateNumber(el, start, end, duration) {
        if (!el) return;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * eased);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // ═══════════════════════════════════════════════
    // HEART PARTICLES
    // ═══════════════════════════════════════════════

    function triggerHeartReveal() {
        heartParticles.innerHTML = '';

        // Create floating particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${['#00ff41', '#00ffff', '#bf40ff', '#ff00ff', '#ffff00'][Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                box-shadow: 0 0 ${Math.random() * 15 + 5}px currentColor;
                animation: particle-float ${Math.random() * 6 + 4}s ease-in-out ${Math.random() * 3}s infinite;
            `;
            heartParticles.appendChild(particle);
        }

        // Inject particle animation keyframes
        if (!document.getElementById('particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = `
                @keyframes particle-float {
                    0%, 100% {
                        opacity: 0;
                        transform: translate(0, 0) scale(0);
                    }
                    25% {
                        opacity: 0.8;
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -80 - 20}px) scale(1);
                    }
                    50% {
                        opacity: 0.4;
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -80 - 40}px) scale(0.8);
                    }
                    75% {
                        opacity: 0.7;
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 60}px) scale(0.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Staggered reveal of heart content
        const elements = heartReveal.querySelectorAll('h1, p, .heart-message, .heart-stats, .btn-heart, .heart-footer');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s ease-out ${i * 0.2}s, transform 0.8s ease-out ${i * 0.2}s`;

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + i * 200);
        });

        // Animate stats after content
        setTimeout(animateStats, 2500);
    }

    // ═══════════════════════════════════════════════
    // MATRIX RAIN EASTER EGG
    // ═══════════════════════════════════════════════

    function triggerMatrixRain() {
        addTerminalLine('<span style="color: #00ff41">▸ ACTIVATING MATRIX PROTOCOL...</span>', false);

        const matrix = document.createElement('div');
        matrix.id = 'matrix-overlay';
        matrix.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 9997; pointer-events: none; overflow: hidden;
        `;
        document.body.appendChild(matrix);

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789@#$%';
        const columns = Math.floor(window.innerWidth / 16);

        for (let i = 0; i < columns; i++) {
            const col = document.createElement('div');
            col.style.cssText = `
                position: absolute;
                top: -100px;
                left: ${i * 16}px;
                font-family: monospace;
                font-size: 14px;
                color: #00ff41;
                writing-mode: vertical-lr;
                text-orientation: mixed;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: matrix-drop ${Math.random() * 4 + 3}s linear ${Math.random() * 5}s infinite;
            `;
            col.textContent = Array(20).fill(null).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
            matrix.appendChild(col);
        }

        // Inject animation
        if (!document.getElementById('matrix-keyframes')) {
            const style = document.createElement('style');
            style.id = 'matrix-keyframes';
            style.textContent = `
                @keyframes matrix-drop {
                    0% { transform: translateY(-100px); }
                    100% { transform: translateY(110vh); }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-remove after 8 seconds
        setTimeout(() => {
            matrix.style.transition = 'opacity 1s';
            matrix.style.opacity = '0';
            setTimeout(() => matrix.remove(), 1000);
        }, 8000);

        setTimeout(() => {
            addTerminalLine('<span style="color: var(--text-dim)">▸ Reality reasserted.</span>', false);
        }, 2000);
    }

    // ═══════════════════════════════════════════════
    // RANDOM GLITCH EFFECTS
    // ═══════════════════════════════════════════════

    function startRandomGlitches() {
        const glitchEvents = [
            () => {
                // Brief screen displacement
                const el = document.querySelector('.screen.active');
                if (el) {
                    el.style.transform = 'translate(2px, -1px) skew(1deg)';
                    setTimeout(() => { el.style.transform = ''; }, 100);
                }
            },
            () => {
                // Invert colors briefly
                document.body.style.filter = 'invert(1)';
                setTimeout(() => { document.body.style.filter = ''; }, 50);
            },
            () => {
                // Flash a green pixel line
                const line = document.createElement('div');
                line.style.cssText = `
                    position: fixed; left: 0; width: 100%; height: 2px;
                    background: var(--neon-green); z-index: 9999; pointer-events: none;
                    opacity: 0.3; animation: none;
                `;
                line.style.top = Math.random() * 100 + '%';
                document.body.appendChild(line);
                setTimeout(() => line.remove(), 100);
            },
            () => {
                // Random character swap in nav
                const links = document.querySelectorAll('.nav-links a');
                if (links.length) {
                    const link = links[Math.floor(Math.random() * links.length)];
                    const original = link.textContent;
                    link.textContent = '✗' + original.slice(1);
                    setTimeout(() => { link.textContent = original; }, 200);
                }
            },
            () => {
                // Cursor trail
                for (let i = 0; i < 3; i++) {
                    const trail = document.createElement('div');
                    trail.style.cssText = `
                        position: fixed;
                        width: 4px; height: 4px;
                        background: var(--neon-green);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 10001;
                        opacity: 0.5;
                        animation: trail-fade 0.5s forwards;
                    `;
                    document.body.appendChild(trail);
                    setTimeout(() => trail.remove(), 500);
                }
            },
        ];

        if (!document.getElementById('trail-keyframes')) {
            const style = document.createElement('style');
            style.id = 'trail-keyframes';
            style.textContent = `
                @keyframes trail-fade {
                    0% { opacity: 0.5; transform: scale(1); }
                    100% { opacity: 0; transform: scale(3); }
                }
            `;
            document.head.appendChild(style);
        }

        state.glitchInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                const event = glitchEvents[Math.floor(Math.random() * glitchEvents.length)];
                event();
            }
        }, 3000);
    }

    // ═══════════════════════════════════════════════
    // KEYBOARD EASTER EGGS
    // ═══════════════════════════════════════════════

    function setupKeyboardEasterEggs() {
        document.addEventListener('keydown', (e) => {
            // Konami code: up up down down left right left right b a
            // (simplified detection)
            if (e.key === 'F12') {
                e.preventDefault();
                addTerminalLine('<span style="color: var(--neon-amber)">▸ Are you looking for something behind the curtain?</span>', false);
                addTerminalLine('<span style="color: var(--text-dim)">▸ The real secrets are in the labyrinth itself.</span>', false);
            }

            if (e.key === 'Escape' && state.currentScreen !== 'screen-gate') {
                // Go back one screen
                if (state.currentScreen === 'screen-heart') return;
                showScreen('screen-gate');
            }
        });
    }

    // ═══════════════════════════════════════════════
    // PERIODIC RANDOM EVENTS
    // ═══════════════════════════════════════════════

    function startAmbientEvents() {
        // Periodically change a nav link text
        setInterval(() => {
            const links = document.querySelectorAll('.nav-links a');
            if (links.length) {
                const link = links[Math.floor(Math.random() * links.length)];
                const glitchChars = '█▓▒░╳╳╱╲┼╳';
                const orig = link.dataset.original || link.textContent;
                link.dataset.original = orig;

                if (Math.random() < 0.3) {
                    const glitched = orig.split('').map(c =>
                        Math.random() < 0.4 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c
                    ).join('');
                    link.textContent = glitched;
                    setTimeout(() => { link.textContent = orig; }, 300);
                }
            }
        }, 5000);

        // Periodically flicker error number
        setInterval(() => {
            const digits = document.querySelectorAll('.glitch-digit');
            if (digits.length) {
                const digit = digits[Math.floor(Math.random() * digits.length)];
                digit.style.textShadow = '0 0 20px #ff0040, 0 0 40px #ff0040';
                setTimeout(() => { digit.style.textShadow = ''; }, 200);
            }
        }, 4000);
    }

    // ═══════════════════════════════════════════════
    // LAUNCH
    // ═══════════════════════════════════════════════

    init();
    setupKeyboardEasterEggs();
    startAmbientEvents();

})();
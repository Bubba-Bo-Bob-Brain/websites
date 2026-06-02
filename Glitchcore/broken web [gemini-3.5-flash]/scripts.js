// SYSTEM_FAILURE: SCRIPTS.JS
// Immersive Interactive Decay System & Simulation Mechanics

document.addEventListener('DOMContentLoaded', () => {
    // Initial State Variables
    let audioContext = null;
    let systemMuted = false;
    let bypassAllowed = false;
    let dumpProgress = 0;
    let systemClocks = document.querySelectorAll('#system-clock');
    
    // Command History for Terminal
    const commandHistory = [];
    let historyIndex = -1;

    // Game / Discovery State
    const decryptedKeys = {
        'key-alpha': false,
        'key-beta': false,
        'key-gamma': false
    };

    // Initialize UI Components & Boot Flow
    startBsodMemoryDump();
    populateDatabase();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);

    // Audio Engine Setup (Web Audio API Synthesizer)
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSynthBeep(freq, type, duration) {
        if (systemMuted) return;
        initAudio();
        if (!audioContext) return;

        try {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq || 440, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Audio Context might be suspended or blocked by user gesture
        }
    }

    function playStaticNoise() {
        if (systemMuted) return;
        initAudio();
        if (!audioContext) return;

        try {
            const bufferSize = audioContext.sampleRate * 0.4; // 0.4 seconds
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseNode = audioContext.createBufferSource();
            noiseNode.buffer = buffer;

            const filter = audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;

            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.35);

            noiseNode.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            noiseNode.start();
        } catch (e) {}
    }

    // BSOD Flow: Physical Memory Dump Simulation
    function startBsodMemoryDump() {
        const percentageEl = document.getElementById('dump-percentage');
        
        const interval = setInterval(() => {
            if (dumpProgress < 100) {
                dumpProgress += Math.floor(Math.random() * 15) + 5;
                if (dumpProgress > 100) dumpProgress = 100;
                percentageEl.textContent = dumpProgress;
                
                // Beep pitch shifts up as percentage rises
                playSynthBeep(200 + (dumpProgress * 5), 'square', 0.05);
            } else {
                clearInterval(interval);
                bypassAllowed = true;
                const actionText = document.querySelector('.bsod-action');
                actionText.classList.add('blink-key');
                actionText.style.color = '#33ff33';
                playSynthBeep(880, 'sine', 0.4);
            }
        }, 300);
    }

    // Mount System File Directory & Fade out BSOD
    function bypassBSOD() {
        if (!bypassAllowed) return;
        
        playSynthBeep(1200, 'sine', 0.1);
        setTimeout(() => playSynthBeep(1600, 'sine', 0.2), 100);

        const bsodScreen = document.getElementById('screen-bsod');
        const labyrinthScreen = document.getElementById('screen-labyrinth');

        bsodScreen.classList.add('hidden');
        labyrinthScreen.classList.remove('hidden');

        // Output system boots to custom console
        printConsoleLine("SYSTEM INTEGRITY CRITICAL. BOOT SECTOR FORCED.");
        printConsoleLine("Warning: Local databases show signs of bit-rot.");
        printConsoleLine("Scan sector keys or find artifacts to decrypt Core.");
    }

    // Real-Time System Clock Updater
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formatted = `${hours}:${minutes}:${seconds}`;
        
        systemClocks.forEach(clock => {
            clock.textContent = formatted;
        });
    }

    // Populating Interactive Leaked Database
    function populateDatabase() {
        const tbody = document.getElementById('database-body');
        const sectors = ['SYS_ROOT', 'NET_CACHE', 'USER_CREDENTIALS', 'LOG_BACKUP', 'DECAY_VALLEY'];
        const payloads = [
            'admin:pass_hash_1998_backup',
            'ERROR_CODE:0xDECAY_VALLEY_STABLE',
            'GET /index.html HTTP/1.0 404 -',
            'TRUNCATE TABLE systems_logs_decay',
            'DECRYPT_KEY_BETA: [REDACTED_GHOST]'
        ];

        for (let i = 0; i < 8; i++) {
            const tr = document.createElement('tr');
            
            const timestamp = `1998-12-11 23:${10 + i}:${24 + (i * 3)}`;
            const sector = sectors[i % sectors.length];
            const ip = `192.168.0.${10 + i}`;
            const payload = payloads[i % payloads.length];
            const status = i % 3 === 0 ? 'CORRUPT' : 'STABLE';

            tr.innerHTML = `
                <td>${timestamp}</td>
                <td class="table-corrupt-cell">${sector}</td>
                <td>${ip}</td>
                <td class="table-corrupt-cell readable-leak" data-raw="${payload}">${payload}</td>
                <td class="status-cell">${status}</td>
            `;

            tbody.appendChild(tr);
        }
    }

    // Terminal Emulator Actions
    function handleConsoleCommand(cmd) {
        const sanitized = cmd.trim().toLowerCase();
        printConsoleLine(`> ${cmd}`);

        if (sanitized === 'help') {
            printConsoleLine("--- DECAY_OS UTILITY HELP ---");
            printConsoleLine("scan     : Analyze and search for fragmented system keys.");
            printConsoleLine("decrypt  : Attempts to build direct bypass connection.");
            printConsoleLine("status   : Readout real-time diagnostic telemetry.");
            printConsoleLine("clear    : Purge terminal console memory.");
        } else if (sanitized === 'scan') {
            printConsoleLine("Scanning directories for encrypted structures...");
            setTimeout(() => {
                let foundKeys = [];
                if (decryptedKeys['key-alpha']) foundKeys.push("KEY_ALPHA");
                if (decryptedKeys['key-beta']) foundKeys.push("KEY_BETA");
                if (decryptedKeys['key-gamma']) foundKeys.push("KEY_GAMMA");

                if (foundKeys.length === 0) {
                    printConsoleLine("Result: 0 operational keys resolved. Go to ARTIFACTS tab to recover keys.");
                } else {
                    printConsoleLine(`Result: Found operational: [${foundKeys.join(', ')}]`);
                    if (foundKeys.length === 3) {
                        printConsoleLine("System override is ready. Execute 'decrypt' command.");
                    } else {
                        printConsoleLine(`Collect remaining ${3 - foundKeys.length} artifact keys.`);
                    }
                }
            }, 800);
        } else if (sanitized === 'decrypt') {
            if (decryptedKeys['key-alpha'] && decryptedKeys['key-beta'] && decryptedKeys['key-gamma']) {
                printConsoleLine("DECRYPTION AUTHORIZED. INITIALIZING STABLE PIPELINE...");
                setTimeout(() => {
                    revealCoreSanctuary();
                }, 1500);
            } else {
                printConsoleLine("Error: Keys missing. Find all 3 artifact items to decrypt system core.");
            }
        } else if (sanitized === 'status') {
            printConsoleLine(`--- INTEGRITY: 14.2% ---`);
            printConsoleLine(`MEM_LEAK: Critical in SECTOR 7`);
            printConsoleLine(`SYS_TEMP: 104°C`);
            printConsoleLine(`KEYS_RESCUED: ${Object.values(decryptedKeys).filter(v => v).length}/3`);
        } else if (sanitized === 'clear') {
            document.getElementById('console-output').innerHTML = '';
        } else {
            printConsoleLine(`Error: Command '${cmd}' unrecognized. Memory corrupted.`, true);
        }

        playSynthBeep(600, 'triangle', 0.08);
    }

    function printConsoleLine(text, isError = false) {
        const consoleOutput = document.getElementById('console-output');
        const p = document.createElement('p');
        p.className = isError ? 'system-msg error' : 'system-msg';
        p.textContent = text;
        consoleOutput.appendChild(p);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    // Navigation & Interactive Tabs System
    function switchTab(targetTab) {
        // Toggle view sections
        document.querySelectorAll('.viewport-section').forEach(sec => {
            sec.classList.add('hidden-section');
        });

        const activeSec = document.getElementById(`view-${targetTab}`);
        if (activeSec) {
            activeSec.classList.remove('hidden-section');
        }

        // Toggle active style in Navigation
        document.querySelectorAll('.nav-link-decay').forEach(link => {
            link.classList.remove('active-tab');
            if (link.getAttribute('href') === `#${targetTab}`) {
                link.classList.add('active-tab');
            }
        });

        playSynthBeep(700, 'sine', 0.05);
    }

    // Core Sanctuary Trigger: Clean State Reached
    function revealCoreSanctuary() {
        playSynthBeep(1000, 'sine', 0.3);
        setTimeout(() => playSynthBeep(1300, 'sine', 0.3), 150);
        setTimeout(() => playSynthBeep(1600, 'sine', 0.6), 300);

        document.getElementById('screen-labyrinth').classList.add('hidden');
        document.getElementById('screen-core').classList.remove('hidden');
    }

    // Element Decaying Interactions
    function registerMeltEvent(element) {
        element.addEventListener('click', () => {
            element.classList.add('melt-active');
            playStaticNoise();
            printConsoleLine(`SYSTEM REPORT: Element ${element.id} structures melted to bottom.`);
            
            // Check for hidden clues in the text melting
            if (element.id === 'melt-target-1') {
                setTimeout(() => {
                    printConsoleLine("DECAY_REVEAL: Hidden log code 'KEY_BETA' extracted from melt-residue!");
                    decryptedKeys['key-beta'] = true;
                    playSynthBeep(950, 'triangle', 0.2);
                }, 2000);
            }
        });
    }

    // Scrambling Text Interaction
    function scrambleText(element, originalText) {
        let iterations = 0;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+';
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, idx) => {
                    if (idx < iterations) return originalText[idx];
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            iterations += 1/3;
        }, 30);
    }

    // Global Action Event Listeners
    function setupEventListeners() {
        // BSOD Skip Key / Action
        document.getElementById('screen-bsod').addEventListener('click', bypassBSOD);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !document.getElementById('screen-bsod').classList.contains('hidden')) {
                bypassBSOD();
            }
        });

        // Console Input Processing
        const consoleInput = document.getElementById('console-input');
        consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = consoleInput.value;
                if (cmd) {
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    handleConsoleCommand(cmd);
                    consoleInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    consoleInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    consoleInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    consoleInput.value = '';
                }
            }
        });

        // Tab switches via navigation
        document.querySelectorAll('.nav-link-decay').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('href').substring(1);
                switchTab(route === 'lost-artifacts' ? 'artifacts' : route);
            });
        });

        // Interactive Database Leaks
        document.querySelectorAll('.readable-leak').forEach(cell => {
            cell.addEventListener('click', () => {
                const raw = cell.getAttribute('data-raw');
                cell.classList.toggle('scrambled');
                if (cell.classList.contains('scrambled')) {
                    scrambleText(cell, "CRITICAL_MEMORY_CORRUPT_PACKET_99");
                    playStaticNoise();
                } else {
                    cell.textContent = raw;
                    playSynthBeep(440, 'triangle', 0.1);
                }
            });
        });

        // Interactive Melting Areas
        registerMeltEvent(document.getElementById('melt-target-1'));
        registerMeltEvent(document.getElementById('melt-target-2'));
        registerMeltEvent(document.getElementById('melt-target-3'));

        // Scramble Trigger Hover Text
        const scrambleHoverText = document.querySelector('.scramble-trigger-text');
        const origText = scrambleHoverText.textContent;
        scrambleHoverText.addEventListener('mouseenter', () => {
            scrambleText(scrambleHoverText, origText);
            playStaticNoise();
        });

        // Archaeological Artifacts Clicks
        document.querySelectorAll('.artifact-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.getAttribute('data-key');
                if (!decryptedKeys[key]) {
                    decryptedKeys[key] = true;
                    card.style.borderColor = 'var(--terminal-green)';
                    card.style.backgroundColor = 'rgba(51, 255, 51, 0.15)';
                    printConsoleLine(`DECRYPTED: Artifact sector key [${key.toUpperCase()}] recovered!`);
                    playSynthBeep(800, 'sine', 0.25);
                } else {
                    printConsoleLine(`SYSTEM: [${key.toUpperCase()}] is already decrypted and operational.`);
                }
            });
        });

        // Classic Windows 95 Close Actions
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-close');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.style.display = 'none';
                    playSynthBeep(300, 'square', 0.1);
                    printConsoleLine("SYSTEM WARNING: Thread exception warning dismissed.");
                }
            });
        });

        // Mute / Audio Feedback Controller
        const muteBtn = document.getElementById('mute-btn');
        muteBtn.addEventListener('click', () => {
            systemMuted = !systemMuted;
            muteBtn.textContent = systemMuted ? 'AUDIO_OFF' : 'AUDIO_ON';
            muteBtn.style.color = systemMuted ? 'var(--alert-red)' : 'var(--terminal-green)';
            muteBtn.style.borderColor = systemMuted ? 'var(--alert-red)' : 'var(--terminal-green)';
            if (!systemMuted) {
                playSynthBeep(440, 'sine', 0.1);
            }
        });

        // Audio Synth Manual Generator Controls
        document.getElementById('synth-trigger-1').addEventListener('click', () => {
            playSynthBeep(150, 'sawtooth', 0.4);
        });
        document.getElementById('synth-trigger-2').addEventListener('click', () => {
            playSynthBeep(650, 'triangle', 0.3);
        });
        document.getElementById('synth-trigger-3').addEventListener('click', () => {
            playStaticNoise();
        });

        // Start Menu Trigger Look
        const startBtn = document.getElementById('start-menu-trigger');
        const startMenu = document.getElementById('start-menu');
        
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startBtn.classList.toggle('menu-open');
            startMenu.classList.toggle('hidden');
            playSynthBeep(600, 'sine', 0.05);
        });

        document.addEventListener('click', () => {
            startMenu.classList.add('hidden');
            startBtn.classList.remove('menu-open');
        });

        // Start Menu Sub Actions
        document.getElementById('start-trigger-bsod').addEventListener('click', () => {
            // Re-crash System
            dumpProgress = 0;
            bypassAllowed = false;
            document.getElementById('screen-labyrinth').classList.add('hidden');
            document.getElementById('screen-bsod').classList.remove('hidden');
            startBsodMemoryDump();
        });

        document.getElementById('start-trigger-decrypt').addEventListener('click', () => {
            handleConsoleCommand('decrypt');
        });

        document.getElementById('start-trigger-scramble').addEventListener('click', () => {
            playStaticNoise();
            document.querySelectorAll('h3, h4, p').forEach(el => {
                if (el.textContent.length < 150) {
                    scrambleText(el, el.textContent);
                }
            });
            printConsoleLine("SYS_ALERT: Global character sequence scrambled.");
        });

        document.getElementById('start-trigger-shutdown').addEventListener('click', () => {
            document.body.innerHTML = `
                <div style="background:#000;color:#f00;height:100vh;display:flex;justify-content:center;align-items:center;font-family:monospace;font-size:1.5rem;text-align:center;">
                    <div>
                        <p>--- IT IS NOW SAFE TO TURN OFF YOUR TERMINAL ---</p>
                        <p style="font-size:0.9rem;color:#555;margin-top:1rem;">Connection closed by deep-level socket core.</p>
                    </div>
                </div>
            `;
            if (!systemMuted) {
                playSynthBeep(120, 'square', 1.0);
            }
        });

        // Return from Sanctuary to main directory
        document.getElementById('leave-core-btn').addEventListener('click', () => {
            document.getElementById('screen-core').classList.add('hidden');
            document.getElementById('screen-labyrinth').classList.remove('hidden');
            printConsoleLine("SYSTEM OVERRIDE: Resumed terminal supervision state.");
        });
    }
});
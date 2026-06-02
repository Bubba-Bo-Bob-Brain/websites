/* ============================================
   CHRONOS/72 — OPERATING SYSTEM JAVASCRIPT
   VERSION 3.7.1 — COPYRIGHT 1972 CHRONOS CORP
   ============================================ */

(function() {
    'use strict';

    /* === SYSTEM STATE === */
    const SystemState = {
        currentTime: new Date(1972, 2, 15, 8, 0, 0),
        selectedFile: null,
        currentDirectory: 'C:\\CHRONOS\\SYSTEM\\',
        dialPosition: 0,
        tapePlaying: false,
        tapeCounter: 0,
        cpuLoad: 15,
        memoryLoad: 32,
        logEntries: [],
        commandHistory: [],
        historyIndex: -1,
        capsLock: false,
        numLock: true
    };

    /* === FILE SYSTEM DATA === */
    const FileSystem = {
        'C:\\CHRONOS\\SYSTEM\\': [
            { name: 'SYSTEM', type: 'dir', size: 'DIR', date: '01.01.72' },
            { name: 'DRIVERS', type: 'dir', size: 'DIR', date: '01.01.72' },
            { name: 'CONFIG.SYS', type: 'sys', size: 4096, date: '03.15.72' },
            { name: 'KERNEL.BIN', type: 'bin', size: 32768, date: '02.28.72' },
            { name: 'DISPLAY.DRV', type: 'drv', size: 8192, date: '03.01.72' },
            { name: 'TAPE_IO.DRV', type: 'drv', size: 6144, date: '02.15.72' },
            { name: 'HELP.TXT', type: 'txt', size: 2048, date: '03.10.72' },
            { name: 'README.1ST', type: 'txt', size: 1024, date: '03.15.72' },
            { name: 'BASIC.COM', type: 'com', size: 16384, date: '01.15.72' },
            { name: 'EDITOR.COM', type: 'com', size: 12288, date: '02.01.72' },
            { name: 'FORMAT.COM', type: 'com', size: 8192, date: '01.20.72' },
            { name: 'BACKUP.COM', type: 'com', size: 10240, date: '02.10.72' }
        ],
        'C:\\CHRONOS\\DRIVERS\\': [
            { name: '..', type: 'dir', size: 'DIR', date: '01.01.72' },
            { name: 'CRT.DRV', type: 'drv', size: 4096, date: '01.15.72' },
            { name: 'TAPE.DRV', type: 'drv', size: 3072, date: '01.20.72' },
            { name: 'PRINTER.DRV', type: 'drv', size: 2048, date: '02.01.72' },
            { name: 'MODEM.DRV', type: 'drv', size: 5120, date: '02.15.72' }
        ]
    };

    /* === UTILITY FUNCTIONS === */
    function padZero(num, digits = 2) {
        return String(num).padStart(digits, '0');
    }

    function formatTime(date) {
        return `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    }

    function formatDate(date) {
        return `${padZero(date.getMonth() + 1, 2)}.${padZero(date.getDate(), 2)}.${date.getFullYear().toString().slice(2)}`;
    }

    function getFileIcon(type) {
        const icons = {
            'dir': '📁',
            'sys': '⚙',
            'bin': '◉',
            'drv': '▣',
            'txt': '📄',
            'com': '▶'
        };
        return icons[type] || '📄';
    }

    function generateRandomHex(bytes) {
        let result = '';
        for (let i = 0; i < bytes; i++) {
            result += padZero(Math.floor(Math.random() * 256).toString(16).toUpperCase());
        }
        return result;
    }

    /* === LOG SYSTEM === */
    const LogSystem = {
        container: null,
        maxLines: 50,

        init() {
            this.container = document.getElementById('ticker-content');
            this.addEntry('CHRONOS/72 BOOT SEQUENCE INITIATED');
            this.addEntry('MEMORY CHECK... 64K OK');
            this.addEntry('MAGNETIC TAPE UNIT 1 ONLINE');
            this.addEntry('CRT DISPLAY INITIALIZED');
            this.addEntry('PERIPHERAL CHECK: ALL UNITS NOMINAL');
            this.addEntry('LOADING SYSTEM CONFIGURATION...');
            this.addEntry('MOUNTING VOLUME: SYSTEM');
            this.addEntry('SYSTEM READY');
        },

        addEntry(message) {
            const timestamp = formatTime(SystemState.currentTime);
            const line = document.createElement('div');
            line.className = 'ticker-line';
            line.textContent = `[${timestamp}] ${message}`;
            
            this.container.appendChild(line);
            SystemState.logEntries.push(`[${timestamp}] ${message}`);

            while (this.container.children.length > this.maxLines) {
                this.container.removeChild(this.container.firstChild);
            }
        },

        clear() {
            this.container.innerHTML = '';
            SystemState.logEntries = [];
            this.addEntry('LOG CLEARED');
        }
    };

    /* === CLOCK SYSTEM === */
    const ClockSystem = {
        init() {
            this.update();
            setInterval(() => this.update(), 1000);
        },

        update() {
            SystemState.currentTime.setSeconds(SystemState.currentTime.getSeconds() + 1);
            
            const clockEl = document.getElementById('system-clock');
            const dateEl = document.getElementById('system-date');
            
            if (clockEl) clockEl.textContent = formatTime(SystemState.currentTime);
            if (dateEl) dateEl.textContent = formatDate(SystemState.currentTime);
        }
    };

    /* === PHOSPHOR SELECTOR === */
    const PhosphorSelector = {
        init() {
            const radios = document.querySelectorAll('input[name="phosphor"]');
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    document.body.classList.remove('phosphor-green', 'phosphor-white');
                    if (e.target.value !== 'amber') {
                        document.body.classList.add(`phosphor-${e.target.value}`);
                    }
                    LogSystem.addEntry(`PHOSPHOR MODE CHANGED TO: ${e.target.value.toUpperCase()}`);
                    this.updateRegisterColors();
                });
            });
        },

        updateRegisterColors() {
            const registers = document.querySelectorAll('.reg-value');
            registers.forEach(reg => {
                reg.style.color = 'var(--phosphor-primary)';
            });
        }
    };

    /* === TOGGLE SWITCHES === */
    const ToggleSwitches = {
        init() {
            const switches = document.querySelectorAll('.toggle-switch input');
            switches.forEach(sw => {
                sw.addEventListener('change', (e) => this.handleToggle(e));
            });
        },

        handleToggle(e) {
            const id = e.target.id;
            const isChecked = e.target.checked;
            const label = e.target.closest('.toggle-switch').querySelector('.switch-label').textContent;

            LogSystem.addEntry(`${label} POWER ${isChecked ? 'ENABLED' : 'DISABLED'}`);

            if (id === 'power-main') {
                document.body.classList.toggle('power-off', !isChecked);
                if (!isChecked) {
                    SystemState.tapePlaying = false;
                    TapeDeck.stop();
                }
            }

            if (id === 'power-display') {
                const effects = document.querySelector('.crt-effects');
                if (effects) effects.style.opacity = isChecked ? '1' : '0';
            }

            if (id === 'power-tape') {
                const deck = document.getElementById('tape-deck');
                if (deck) {
                    deck.style.opacity = isChecked ? '1' : '0.3';
                    if (!isChecked) TapeDeck.stop();
                }
            }

            if (id === 'power-audio') {
                AudioSystem.enabled = isChecked;
                LogSystem.addEntry(`AUDIO SUBSYSTEM ${isChecked ? 'ACTIVE' : 'MUTED'}`);
            }
        }
    };

    /* === VU METERS === */
    const VuMeters = {
        init() {
            this.update();
            setInterval(() => this.update(), 2000);
        },

        update() {
            const cpuVariation = (Math.random() - 0.5) * 20;
            const memVariation = (Math.random() - 0.5) * 10;

            SystemState.cpuLoad = Math.max(5, Math.min(95, SystemState.cpuLoad + cpuVariation));
            SystemState.memoryLoad = Math.max(10, Math.min(80, SystemState.memoryLoad + memVariation));

            if (SystemState.tapePlaying) {
                SystemState.cpuLoad = Math.min(95, SystemState.cpuLoad + 15);
            }

            this.updateNeedle('needle-cpu', SystemState.cpuLoad);
            this.updateNeedle('needle-mem', SystemState.memoryLoad);
        },

        updateNeedle(id, value) {
            const needle = document.getElementById(id);
            if (needle) {
                const angle = -90 + (value * 1.8);
                needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            }
        }
    };

    /* === ROTARY DIAL === */
    const RotaryDial = {
        currentValue: 0,
        values: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],

        init() {
            const dial = document.getElementById('rotary-dial');
            if (!dial) return;

            let isDragging = false;
            let startAngle = 0;
            let currentRotation = 0;

            dial.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = dial.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const rect = dial.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                
                let delta = angle - startAngle;
                if (delta > 180) delta -= 360;
                if (delta < -180) delta += 360;

                currentRotation += delta * 0.5;
                dial.style.transform = `rotate(${currentRotation}deg)`;

                const normalizedRotation = ((currentRotation % 360) + 360) % 360;
                const segmentAngle = 360 / 12;
                const newValue = Math.floor(normalizedRotation / segmentAngle) % 12;

                if (newValue !== this.currentValue) {
                    this.currentValue = newValue;
                    this.updateDisplay();
                }

                startAngle = angle;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    LogSystem.addEntry(`DIRECTORY LETTER SELECTED: ${this.values[this.currentValue]}`);
                }
            });

            dial.addEventListener('click', () => {
                this.currentValue = (this.currentValue + 1) % 12;
                currentRotation += 30;
                dial.style.transform = `rotate(${currentRotation}deg)`;
                this.updateDisplay();
                LogSystem.addEntry(`DIRECTORY LETTER SELECTED: ${this.values[this.currentValue]}`);
            });
        },

        updateDisplay() {
            const display = document.getElementById('dial-value');
            if (display) {
                display.textContent = this.values[this.currentValue];
            }
        }
    };

    /* === TAPE DECK === */
    const TapeDeck = {
        init() {
            const buttons = document.querySelectorAll('.deck-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleButton(e.target.id));
            });
        },

        handleButton(id) {
            const reels = document.querySelectorAll('.reel');
            
            switch(id) {
                case 'tape-rewind':
                    this.rewind();
                    break;
                case 'tape-stop':
                    this.stop();
                    break;
                case 'tape-play-btn':
                    this.play();
                    break;
                case 'tape-forward':
                    this.forward();
                    break;
            }

            document.querySelectorAll('.deck-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(id)?.classList.add('active');
        },

        play() {
            SystemState.tapePlaying = true;
            document.getElementById('tape-ready').classList.remove('active');
            document.getElementById('tape-play').classList.add('active');
            document.getElementById('tape-rec').classList.remove('active');
            
            LogSystem.addEntry('TAPE PLAYBACK STARTED');
            this.startReelAnimation();
            this.startCounter();
        },

        stop() {
            SystemState.tapePlaying = false;
            document.getElementById('tape-ready').classList.add('active');
            document.getElementById('tape-play').classList.remove('active');
            document.getElementById('tape-rec').classList.remove('active');
            
            LogSystem.addEntry('TAPE PLAYBACK STOPPED');
            this.stopReelAnimation();
            this.stopCounter();
        },

        rewind() {
            LogSystem.addEntry('TAPE REWINDING...');
            const reels = document.querySelectorAll('.reel-spokes');
            reels.forEach(reel => {
                reel.style.animationDuration = '0.3s';
                reel.style.animationDirection = 'reverse';
            });
            
            setTimeout(() => {
                this.stopReelAnimation();
                SystemState.tapeCounter = 0;
                this.updateCounter();
                LogSystem.addEntry('TAPE REWOUND TO BEGINNING');
            }, 2000);
        },

        forward() {
            LogSystem.addEntry('TAPE FAST FORWARD...');
            const reels = document.querySelectorAll('.reel-spokes');
            reels.forEach(reel => {
                reel.style.animationDuration = '0.2s';
            });
            
            setTimeout(() => {
                this.stopReelAnimation();
                LogSystem.addEntry('FAST FORWARD COMPLETE');
            }, 1500);
        },

        startReelAnimation() {
            const reels = document.querySelectorAll('.reel-spokes');
            reels.forEach(reel => {
                reel.style.animationDuration = '1s';
                reel.style.animationPlayState = 'running';
            });
        },

        stopReelAnimation() {
            const reels = document.querySelectorAll('.reel-spokes');
            reels.forEach(reel => {
                reel.style.animationPlayState = 'paused';
            });
        },

        counterInterval: null,

        startCounter() {
            this.counterInterval = setInterval(() => {
                SystemState.tapeCounter++;
                if (SystemState.tapeCounter > 9999) SystemState.tapeCounter = 0;
                this.updateCounter();
            }, 500);
        },

        stopCounter() {
            if (this.counterInterval) {
                clearInterval(this.counterInterval);
                this.counterInterval = null;
            }
        },

        updateCounter() {
            const digits = document.querySelectorAll('.counter-digit');
            const value = String(SystemState.tapeCounter).padStart(4, '0');
            digits.forEach((digit, i) => {
                digit.textContent = value[i];
            });
        }
    };

    /* === FILE BROWSER === */
    const FileBrowser = {
        init() {
            const fileList = document.getElementById('file-list');
            if (fileList) {
                fileList.addEventListener('click', (e) => this.handleFileClick(e));
            }
        },

        handleFileClick(e) {
            const fileItem = e.target.closest('.file-item');
            if (!fileItem) return;

            document.querySelectorAll('.file-item').forEach(item => item.classList.remove('selected'));
            fileItem.classList.add('selected');

            const fileName = fileItem.querySelector('.file-name').textContent;
            const fileType = fileItem.dataset.type;
            
            SystemState.selectedFile = { name: fileName, type: fileType };
            
            const selectedEl = document.getElementById('selected-file');
            if (selectedEl) selectedEl.textContent = `SELECTED: ${fileName}`;

            LogSystem.addEntry(`FILE SELECTED: ${fileName}`);

            if (fileType === 'dir' && fileName !== '..') {
                this.navigateToDirectory(fileName);
            } else if (fileName === '..') {
                this.navigateUp();
            }
        },

        navigateToDirectory(dirName) {
            const newPath = SystemState.currentDirectory + dirName + '\\';
            
            if (FileSystem[newPath]) {
                SystemState.currentDirectory = newPath;
                this.refreshFileList();
                LogSystem.addEntry(`DIRECTORY CHANGED TO: ${newPath}`);
                this.updatePathDisplay();
            }
        },

        navigateUp() {
            const parts = SystemState.currentDirectory.split('\\').filter(p => p);
            if (parts.length > 2) {
                parts.pop();
                parts.pop();
                SystemState.currentDirectory = parts.join('\\') + '\\';
                this.refreshFileList();
                LogSystem.addEntry(`DIRECTORY CHANGED TO: ${SystemState.currentDirectory}`);
                this.updatePathDisplay();
            }
        },

        refreshFileList() {
            const fileList = document.getElementById('file-list');
            const files = FileSystem[SystemState.currentDirectory] || [];
            
            fileList.innerHTML = files.map(file => `
                <div class="file-item ${file.type === 'dir' ? 'directory' : 'file'}" 
                     data-name="${file.name}" 
                     data-type="${file.type}">
                    <span class="file-icon">${getFileIcon(file.type)}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${file.size}</span>
                    <span class="file-date">${file.date}</span>
                </div>
            `).join('');

            const countEl = document.getElementById('file-count');
            if (countEl) countEl.textContent = `${files.length} ENTRIES`;
        },

        updatePathDisplay() {
            const pathEl = document.getElementById('current-path');
            if (pathEl) pathEl.textContent = SystemState.currentDirectory;
        }
    };

    /* === CASSETTE RACK === */
    const CassetteRack = {
        init() {
            const cassettes = document.querySelectorAll('.cassette');
            cassettes.forEach(cassette => {
                cassette.addEventListener('click', () => this.handleCassetteClick(cassette));
            });
        },

        handleCassetteClick(cassette) {
            const tapeId = cassette.dataset.tape;
            const label = cassette.querySelector('.label-title').textContent;
            
            document.querySelectorAll('.cassette').forEach(c => c.classList.remove('active'));
            cassette.classList.add('active');

            LogSystem.addEntry(`CASSETTE LOADED: ${label} (#${tapeId})`);
            
            TapeDeck.play();
            document.querySelectorAll('.deck-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tape-play-btn').classList.add('active');
            document.getElementById('tape-ready').classList.remove('active');
            document.getElementById('tape-play').classList.add('active');
        }
    };

    /* === REGISTER DISPLAY === */
    const RegisterDisplay = {
        registers: ['A', 'B', 'C', 'D', 'PC', 'SP', 'FL'],

        init() {
            this.update();
            setInterval(() => this.update(), 1500);
        },

        update() {
            const values = {
                'A': generateRandomHex(2),
                'B': generateRandomHex(2),
                'C': generateRandomHex(2),
                'D': generateRandomHex(2),
                'PC': 'FF' + padZero(Math.floor(Math.random() * 256).toString(16).toUpperCase()),
                'SP': 'FF' + padZero(Math.floor(Math.random() * 256).toString(16).toUpperCase()),
                'FL': this.generateFlags()
            };

            this.registers.forEach(reg => {
                const el = document.getElementById(`reg-${reg.toLowerCase()}`);
                if (el) {
                    el.textContent = values[reg];
                }
            });
        },

        generateFlags() {
            const flags = ['-', '-', '-', '-', '-', 'Z', 'C', 'V', '-'];
            flags[5] = Math.random() > 0.5 ? 'Z' : '-';
            flags[6] = Math.random() > 0.5 ? 'C' : '-';
            flags[7] = Math.random() > 0.5 ? 'V' : '-';
            return flags.join('');
        }
    };

    /* === COMMAND INPUT === */
    const CommandInput = {
        init() {
            const input = document.getElementById('command-input');
            const execBtn = document.getElementById('cmd-exec');
            const clearBtn = document.getElementById('cmd-clear');

            if (input) {
                input.addEventListener('keydown', (e) => this.handleKeyDown(e));
                input.focus();
            }

            if (execBtn) {
                execBtn.addEventListener('click', () => this.executeCommand());
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearConsole());
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'CapsLock') {
                    SystemState.capsLock = !SystemState.capsLock;
                    this.updateKeyIndicators();
                }
                if (e.key === 'NumLock') {
                    SystemState.numLock = !SystemState.numLock;
                    this.updateKeyIndicators();
                }
            });
        },

        handleKeyDown(e) {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        },

        executeCommand() {
            const input = document.getElementById('command-input');
            const command = input.value.trim().toUpperCase();
            
            if (!command) return;

            LogSystem.addEntry(`C:\\> ${command}`);
            SystemState.commandHistory.push(command);
            SystemState.historyIndex = SystemState.commandHistory.length;

            const response = this.processCommand(command);
            if (response) {
                LogSystem.addEntry(response);
            }

            input.value = '';
            this.updateStatusMessage('COMMAND EXECUTED');
        },

        processCommand(cmd) {
            const commands = {
                'DIR': () => this.cmdDir(),
                'CLS': () => { LogSystem.clear(); return null; },
                'VER': () => 'CHRONOS/72 VERSION 3.7.1',
                'DATE': () => `CURRENT DATE: ${formatDate(SystemState.currentTime)}`,
                'TIME': () => `CURRENT TIME: ${formatTime(SystemState.currentTime)}`,
                'HELP': () => 'COMMANDS: DIR, CLS, VER, DATE, TIME, HELP, LOAD, SAVE, RUN, TYPE, MEM',
                'MEM': () => 'MEMORY: 64K TOTAL, 48K FREE, 16K USED',
                'LOAD': () => { TapeDeck.play(); return 'LOADING FROM TAPE...'; },
                'SAVE': () => { TapeDeck.play(); return 'SAVING TO TAPE...'; },
                'RUN': () => 'EXECUTING PROGRAM...',
                'TYPE': () => 'SYNTAX: TYPE [FILENAME]'
            };

            const baseCmd = cmd.split(' ')[0];
            
            if (commands[baseCmd]) {
                return commands[baseCmd]();
            }
            
            return `UNKNOWN COMMAND: ${baseCmd}. TYPE HELP FOR COMMANDS.`;
        },

        cmdDir() {
            const files = FileSystem[SystemState.currentDirectory] || [];
            const count = files.length;
            LogSystem.addEntry(`${count} FILE(S) IN ${SystemState.currentDirectory}`);
            return null;
        },

        navigateHistory(direction) {
            const input = document.getElementById('command-input');
            SystemState.historyIndex += direction;
            
            if (SystemState.historyIndex < 0) {
                SystemState.historyIndex = 0;
            } else if (SystemState.historyIndex >= SystemState.commandHistory.length) {
                SystemState.historyIndex = SystemState.commandHistory.length;
                input.value = '';
                return;
            }
            
            input.value = SystemState.commandHistory[SystemState.historyIndex];
        },

        clearConsole() {
            LogSystem.clear();
            this.updateStatusMessage('CONSOLE CLEARED');
        },

        updateStatusMessage(msg) {
            const statusEl = document.getElementById('status-message');
            if (statusEl) {
                statusEl.textContent = msg;
                setTimeout(() => {
                    statusEl.textContent = 'READY FOR INPUT';
                }, 3000);
            }
        },

        updateKeyIndicators() {
            const capsEl = document.getElementById('caps-lock');
            const numEl = document.getElementById('num-lock');
            
            if (capsEl) capsEl.classList.toggle('active', SystemState.capsLock);
            if (numEl) numEl.classList.toggle('active', SystemState.numLock);
        }
    };

    /* === AUDIO SYSTEM (Simulated) === */
    const AudioSystem = {
        enabled: false,
        context: null,

        init() {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                LogSystem.addEntry('AUDIO SUBSYSTEM NOT AVAILABLE');
            }
        },

        playBeep(frequency = 440, duration = 0.1) {
            if (!this.enabled || !this.context) return;

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        },

        playStartup() {
            if (!this.enabled || !this.context) return;

            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playBeep(freq, 0.15), i * 150);
            });
        }
    };

    /* === SYSTEM STATUS INDICATOR === */
    const SystemStatus = {
        init() {
            const indicator = document.getElementById('system-status');
            if (indicator) {
                indicator.textContent = '● SYSTEM READY';
                indicator.style.color = 'var(--phosphor-primary)';
            }
        }
    };

    /* === BOOT SEQUENCE === */
    const BootSequence = {
        async run() {
            LogSystem.addEntry('INITIALIZING CHRONOS/72...');
            
            await this.delay(500);
            LogSystem.addEntry('CHECKING HARDWARE...');
            
            await this.delay(300);
            LogSystem.addEntry('CRT DISPLAY: DETECTED');
            LogSystem.addEntry('TAPE UNIT 1: DETECTED');
            LogSystem.addEntry('KEYBOARD: DETECTED');
            
            await this.delay(400);
            LogSystem.addEntry('LOADING OPERATING SYSTEM...');
            
            await this.delay(600);
            LogSystem.addEntry('CHRONOS/72 V3.7.1 LOADED SUCCESSFULLY');
            
            await this.delay(300);
            LogSystem.addEntry('WELCOME TO CHRONOS/72');
            LogSystem.addEntry('TYPE HELP FOR AVAILABLE COMMANDS');

            AudioSystem.playStartup();
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    /* === INITIALIZATION === */
    function init() {
        ClockSystem.init();
        LogSystem.init();
        PhosphorSelector.init();
        ToggleSwitches.init();
        VuMeters.init();
        RotaryDial.init();
        TapeDeck.init();
        FileBrowser.init();
        CassetteRack.init();
        RegisterDisplay.init();
        CommandInput.init();
        SystemStatus.init();
        AudioSystem.init();

        BootSequence.run();

        LogSystem.addEntry('ALL SYSTEMS INITIALIZED');
        LogSystem.addEntry('READY FOR OPERATOR INPUT');
    }

    /* === START SYSTEM === */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
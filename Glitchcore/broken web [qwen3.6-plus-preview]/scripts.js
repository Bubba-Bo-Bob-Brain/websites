/*
    DIGITAL NECROPOLIS - INTERACTIVE SCRIPT
    Handles: Screen transitions, text effects, terminal, hidden content, glitch effects
*/

// === UTILITY FUNCTIONS ===

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// === TEXT EFFECTS ===

class TextScrambler {
    constructor(element) {
        this.element = element;
        this.originalText = element.dataset.original || element.textContent;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.frame = 0;
        this.queue = [];
        this.isRunning = false;
    }

    scramble() {
        this.frame = 0;
        this.queue = [];
        
        for (let i = 0; i < this.originalText.length; i++) {
            const char = this.originalText[i];
            this.queue.push({
                from: char,
                to: randomChoice(this.chars),
                end: Math.floor(Math.random() * 30) + 10
            });
        }
        
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    animate() {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < this.queue.length; i++) {
            if (this.frame >= this.queue[i].end) {
                output += this.queue[i].from;
                complete++;
            } else {
                output += randomChoice(this.chars);
            }
        }
        
        this.element.textContent = output;
        this.frame++;
        
        if (complete < this.queue.length) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }
}

// Initialize scramble texts
function initScrambleTexts() {
    document.querySelectorAll('.scramble-text').forEach(el => {
        const scrambler = new TextScrambler(el);
        
        // Scramble on hover
        el.addEventListener('mouseenter', () => scrambler.scramble());
        
        // Random scrambling periodically
        setInterval(() => {
            if (Math.random() > 0.7) {
                scrambler.scramble();
            }
        }, 5000);
    });
}

// === GLITCH EFFECTS ===

class GlitchSystem {
    constructor() {
        this.container = document.getElementById('glitch-container');
        this.isGlitching = false;
    }

    triggerGlitch() {
        if (this.isGlitching) return;
        this.isGlitching = true;
        
        const duration = randomInt(100, 400);
        const numBars = randomInt(3, 8);
        
        for (let i = 0; i < numBars; i++) {
            this.createGlitchBar();
        }
        
        setTimeout(() => {
            this.container.innerHTML = '';
            this.isGlitching = false;
        }, duration);
    }

    createGlitchBar() {
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: absolute;
            width: 100%;
            height: ${randomInt(2, 20)}px;
            top: ${randomInt(0, 100)}%;
            left: ${randomInt(-20, 20)}px;
            background: ${randomChoice(['rgba(255,0,255,0.3)', 'rgba(0,255,255,0.3)', 'rgba(255,0,0,0.3)'])};
            mix-blend-mode: screen;
            pointer-events: none;
        `;
        this.container.appendChild(bar);
    }

    startPeriodicGlitches() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.triggerGlitch();
            }
        }, 3000);
    }
}

// === SCREEN MANAGER ===

class ScreenManager {
    constructor() {
        this.screens = {};
        this.currentScreen = null;
        this.overlay = document.getElementById('loading-overlay');
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingText = document.getElementById('loading-text');
        this.loadingSubtext = document.getElementById('loading-subtext');
        
        // Initialize screens
        document.querySelectorAll('.screen').forEach(screen => {
            this.screens[screen.dataset.screen] = screen;
        });
        
        this.loadingMessages = [
            'Decompressing corrupted data...',
            'Reconstructing fragments...',
            'Decrypting sectors...',
            'Recovering lost files...',
            'Attempting data restoration...',
            'WARNING: Integrity check failed...',
            'Bypassing security protocols...',
            'Accessing hidden directories...',
            'Loading archive modules...',
            'Scanning for anomalies...'
        ];
    }

    async switchTo(targetId) {
        const target = this.screens[targetId];
        if (!target || target === this.currentScreen) return;
        
        // Show loading overlay
        await this.showLoading();
        
        // Hide current screen
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
        }
        
        // Show target screen
        target.classList.add('active');
        this.currentScreen = target;
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Trigger screen-specific effects
        this.triggerScreenEffects(targetId);
        
        // Hide loading overlay
        await sleep(300);
        this.overlay.hidden = true;
    }

    async showLoading() {
        this.overlay.hidden = false;
        this.loadingBar.style.width = '0%';
        
        const duration = randomInt(800, 1500);
        const steps = 10;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            await sleep(stepDuration);
            this.loadingBar.style.width = `${(i / steps) * 100}%`;
            
            // Random loading messages
            if (i % 2 === 0 && i < steps) {
                this.loadingText.textContent = randomChoice(this.loadingMessages);
                this.loadingSubtext.textContent = `Sector ${randomInt(0x00, 0xFF).toString(16).toUpperCase()}`;
            }
        }
        
        this.loadingText.textContent = 'Access granted.';
        this.loadingSubtext.textContent = '';
        await sleep(200);
    }

    triggerScreenEffects(screenId) {
        switch (screenId) {
            case 'terminal':
                focusTerminalInput();
                break;
            case 'core':
                updateCoreDate();
                break;
        }
    }
}

// === BOOT SEQUENCE ===

class BootSequence {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.container = document.querySelector('.boot-messages');
        this.progressFill = document.querySelector('.progress-fill');
        this.booted = false;
        
        this.init();
    }

    async init() {
        // Animate progress bar
        this.animateProgress();
        
        // Wait for any key press
        document.addEventListener('keydown', (e) => this.handleKey(e));
        document.addEventListener('click', () => this.boot());
    }

    animateProgress() {
        const target = parseInt(this.progressFill.dataset.target) || 73;
        let current = 0;
        
        const interval = setInterval(() => {
            current += 1;
            this.progressFill.textContent = current;
            
            if (current >= target) {
                clearInterval(interval);
            }
        }, 30);
    }

    handleKey(e) {
        if (!this.booted) {
            e.preventDefault();
            this.boot();
        }
    }

    async boot() {
        if (this.booted) return;
        this.booted = true;
        
        // Remove listeners
        document.removeEventListener('keydown', this.handleKey);
        document.removeEventListener('click', this.boot);
        
        // Glitch effect
        glitchSystem.triggerGlitch();
        await sleep(200);
        
        // Switch to hub
        screenManager.switchTo('hub');
        
        if (this.onComplete) {
            this.onComplete();
        }
    }
}

// === TERMINAL ===

class Terminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.history = document.getElementById('terminal-history');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            help: this.cmdHelp.bind(this),
            status: this.cmdStatus.bind(this),
            ls: this.cmdLs.bind(this),
            cat: this.cmdCat.bind(this),
            decrypt: this.cmdDecrypt.bind(this),
            recover: this.cmdRecover.bind(this),
            find: this.cmdFind.bind(this),
            echo: this.cmdEcho.bind(this),
            clear: this.cmdClear.bind(this),
            whoami: this.cmdWhoami.bind(this),
            exit: this.cmdExit.bind(this),
            'the key': this.cmdTheKey.bind(this),
            core: this.cmdCore.bind(this),
        };
        
        this.secretCommands = ['the key', 'core'];
        this.secretUnlocked = false;
        
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
    }

    executeCommand(input) {
        // Echo command
        this.addLine(`USER > ${input}`, 'user');
        
        const parts = input.toLowerCase().split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else if (input.toLowerCase() === 'the key' || input.toLowerCase() === 'core') {
            this.commands[input.toLowerCase()]([]);
        } else {
            this.addLine(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
            
            // Easter egg for typos
            if (Math.random() > 0.8) {
                this.addLine('WARNING: Unauthorized command attempt logged.', 'warning');
            }
        }
        
        // Scroll to bottom
        this.output.scrollTop = this.output.scrollHeight;
    }

    addLine(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        if (type === 'system') {
            line.innerHTML = `<span class="prompt">SYSTEM</span> ${text}`;
        } else if (type === 'error') {
            line.style.color = 'var(--color-error)';
            line.textContent = text;
        } else if (type === 'warning') {
            line.style.color = 'var(--color-warning)';
            line.textContent = text;
        } else if (type === 'success') {
            line.style.color = 'var(--color-cyan)';
            line.textContent = text;
        } else {
            line.textContent = text;
        }
        
        this.history.appendChild(line);
    }

    cmdHelp() {
        const commands = [
            'help          - Show this help message',
            'status        - Show system status',
            'ls            - List directory contents',
            'cat [file]    - Display file contents',
            'decrypt       - Attempt to decrypt archive',
            'recover       - Run data recovery',
            'find [query]  - Search archive',
            'echo [text]   - Echo text back',
            'clear         - Clear terminal',
            'whoami        - Display current user',
            'exit          - Exit terminal'
        ];
        
        commands.forEach(cmd => this.addLine(cmd));
        
        if (this.secretUnlocked) {
            this.addLine('core          - Access the core', 'success');
        }
    }

    cmdStatus() {
        this.addLine('Archive Status: CORRUPTED', 'warning');
        this.addLine(`Integrity: ${Math.random() * 30 + 10}%`);
        this.addLine(`Sectors recovered: ${randomInt(100, 900)}/847`);
        this.addLine(`Last backup: NEVER`);
        this.addLine(`Anomalies detected: ${randomInt(1, 50)}`);
    }

    cmdLs() {
        const files = [
            'errors/',
            'db/',
            'pages/',
            'sys/',
            '??/',
            'lost+found/',
            'core.enc'
        ];
        
        files.forEach(file => {
            this.addLine(file);
        });
    }

    cmdCat(args) {
        if (args.length === 0) {
            this.addLine('Usage: cat [filename]', 'error');
            return;
        }
        
        const file = args[0];
        const responses = {
            'core.enc': 'ENCRYPTED: Requires decryption key. Try "the key" if you know it.',
            'errors.log': 'ERROR: Log file corrupted beyond recovery.',
            'readme.txt': 'If you are reading this, the archive is still alive. Find the core.',
            'secret.txt': 'ERROR: File not found. It was never here.',
        };
        
        if (responses[file]) {
            this.addLine(responses[file]);
        } else {
            this.addLine(`cat: ${file}: No such file or directory`, 'error');
        }
    }

    async cmdDecrypt() {
        this.addLine('Initializing decryption protocol...', 'system');
        await sleep(500);
        this.addLine('Decrypting sector 0x7F3A...', 'system');
        await sleep(500);
        this.addLine('ERROR: Decryption failed. Key not found.', 'error');
        await sleep(300);
        this.addLine('HINT: Some secrets are hidden in plain sight. Look deeper.', 'warning');
    }

    async cmdRecover() {
        this.addLine('Starting data recovery...', 'system');
        await sleep(400);
        this.addLine('Scanning sectors...', 'system');
        await sleep(600);
        this.addLine(`Recovered: ${randomInt(10, 100)} files`, 'success');
        this.addLine(`Lost: ${randomInt(500, 900)} files`, 'error');
        this.addLine('Recovery complete. Archive still corrupted.', 'warning');
    }

    cmdFind(args) {
        if (args.length === 0) {
            this.addLine('Usage: find [query]', 'error');
            return;
        }
        
        const query = args.join(' ').toLowerCase();
        this.addLine(`Searching for "${query}"...`, 'system');
        
        setTimeout(() => {
            if (query.includes('core') || query.includes('truth') || query.includes('key')) {
                this.addLine('Found: /??/???? [ACCESS RESTRICTED]', 'warning');
                this.addLine('HINT: The path to the core lies beyond the void.', 'system');
                this.secretUnlocked = true;
                this.addLine('New command unlocked: core', 'success');
            } else {
                this.addLine(`No results found for "${query}"`, 'error');
            }
        }, 500);
    }

    cmdEcho(args) {
        this.addLine(args.join(' '));
    }

    cmdClear() {
        this.history.innerHTML = '';
    }

    cmdWhoami() {
        const users = ['anonymous', 'ghost_user', 'explorer', 'lost_soul', 'archivist'];
        this.addLine(randomChoice(users));
    }

    cmdExit() {
        this.addLine('There is no exit. The archive is infinite.', 'warning');
        glitchSystem.triggerGlitch();
    }

    cmdTheKey() {
        this.addLine('Key recognized. Decrypting core access...', 'success');
        this.secretUnlocked = true;
        this.addLine('Access granted to the core.', 'success');
        this.addLine('Type "core" to proceed.', 'system');
    }

    cmdCore() {
        if (this.secretUnlocked) {
            this.addLine('Accessing the core...', 'success');
            setTimeout(() => {
                screenManager.switchTo('the-void');
            }, 500);
        } else {
            this.addLine('Access denied. Find the key first.', 'error');
        }
    }
}

// === DATABASE INTERACTIONS ===

function initDatabaseInteractions() {
    // Password reveal on click
    document.querySelectorAll('.cell-password').forEach(cell => {
        cell.addEventListener('click', () => {
            const isHidden = cell.dataset.hidden === 'true';
            if (isHidden) {
                const passwords = ['admin123', 'password', 'letmein', 'NULL', '••••••••', '????????'];
                cell.textContent = randomChoice(passwords);
                cell.dataset.hidden = 'false';
                cell.style.color = 'var(--color-warning)';
            }
        });
    });

    // Reveal hidden rows
    const revealBtn = document.querySelector('[data-action="reveal-hidden"]');
    if (revealBtn) {
        revealBtn.addEventListener('click', () => {
            const hiddenRows = document.querySelector('[data-hidden-content="true"]');
            hiddenRows.classList.add('revealed');
            revealBtn.textContent = 'Rows revealed';
            revealBtn.disabled = true;
            
            // Trigger glitch
            glitchSystem.triggerGlitch();
        });
    }

    // Clickable rows
    document.querySelectorAll('.clickable-row').forEach(row => {
        row.addEventListener('click', () => {
            if (row.dataset.secret === 'true') {
                glitchSystem.triggerGlitch();
                
                // Flash effect
                row.style.background = 'var(--color-magenta)';
                setTimeout(() => {
                    row.style.background = '';
                }, 200);
                
                // Could unlock something here
                if (row.dataset.row === 'hidden-2') {
                    // Unlock the void
                    const hiddenPath = document.querySelector('.nav-link.hidden-path');
                    if (hiddenPath) {
                        hiddenPath.style.opacity = '1';
                        hiddenPath.style.borderColor = 'var(--text-primary)';
                    }
                }
            }
        });
    });
}

// === HIDDEN CONTENT ===

function initHiddenContent() {
    // Clickable fragment in hub
    const clickableFragment = document.querySelector('.clickable-fragment');
    if (clickableFragment) {
        clickableFragment.addEventListener('click', () => {
            const hiddenText = clickableFragment.querySelector('.hidden-text');
            if (hiddenText) {
                hiddenText.textContent = hiddenText.dataset.reveal;
                hiddenText.style.background = 'var(--color-cyan)';
                
                glitchSystem.triggerGlitch();
                
                // Reveal the hidden path in nav
                const hiddenPath = document.querySelector('.nav-link.hidden-path');
                if (hiddenPath) {
                    hiddenPath.style.opacity = '1';
                    hiddenPath.style.borderColor = 'var(--text-primary)';
                    hiddenPath.style.animation = 'pulse 2s infinite';
                }
            }
        });
    }

    // Corrupted guestbook entry
    const corruptedEntry = document.querySelector('.corrupted-entry .hidden-text');
    if (corruptedEntry) {
        corruptedEntry.addEventListener('click', () => {
            corruptedEntry.textContent = corruptedEntry.dataset.reveal;
            corruptedEntry.style.background = 'var(--color-error)';
            glitchSystem.triggerGlitch();
        });
    }

    // Secret sidebar link
    const deadSidebarLink = document.querySelector('.dead-sidebar-link');
    if (deadSidebarLink) {
        deadSidebarLink.addEventListener('click', (e) => {
            e.preventDefault();
            screenManager.switchTo('the-void');
        });
    }

    // Hidden path nav link
    const hiddenPath = document.querySelector('.nav-link.hidden-path');
    if (hiddenPath) {
        hiddenPath.addEventListener('click', (e) => {
            e.preventDefault();
            screenManager.switchTo('the-void');
        });
    }

    // Void fragments
    document.querySelectorAll('.void-fragment').forEach((fragment, index) => {
        fragment.addEventListener('click', () => {
            fragment.style.color = '#fff';
            glitchSystem.triggerGlitch();
            
            if (index === 2) {
                // Last fragment clicked
                document.querySelector('.portal-hint').style.opacity = '1';
                document.querySelector('.void-link').style.opacity = '1';
            }
        });
    });

    // Void link to core
    const voidLink = document.querySelector('.void-link');
    if (voidLink) {
        voidLink.addEventListener('click', (e) => {
            e.preventDefault();
            screenManager.switchTo('the-core');
        });
    }
}

// === NAVIGATION ===

function initNavigation() {
    document.querySelectorAll('.nav-link:not(.hidden-path)').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            if (target) {
                screenManager.switchTo(target);
            }
        });
    });

    // Dead links do something random
    document.querySelectorAll('.dead-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const actions = [
                () => glitchSystem.triggerGlitch(),
                () => link.style.color = 'var(--color-error)',
                () => link.textContent = '[ERROR: LINK ROT]',
                () => {
                    link.style.transform = 'rotate(180deg)';
                    link.style.display = 'inline-block';
                }
            ];
            randomChoice(actions)();
        });
    });

    // Error card interactions
    document.querySelectorAll('.error-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.errorType === 'bsod') {
                glitchSystem.triggerGlitch();
            }
        });
    });

    // Error action buttons
    document.querySelectorAll('.error-action').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'continue') {
                screenManager.switchTo('hub');
            } else if (btn.dataset.action === 'abort') {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#00ff41;font-family:monospace;font-size:2rem;">SYSTEM HALTED</div>';
            }
        });
    });
}

// === CORE SECTION ===

function updateCoreDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function initCoreGuestbook() {
    const form = document.getElementById('core-guestbook-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('input[name="name"]').value;
            const message = form.querySelector('textarea[name="message"]').value;
            
            if (name && message) {
                const messagesContainer = document.getElementById('core-messages');
                const entry = document.createElement('div');
                entry.className = 'core-message-entry';
                entry.innerHTML = `
                    <strong>${name}</strong> — ${new Date().toLocaleDateString()}
                    <p>${message}</p>
                `;
                messagesContainer.appendChild(entry);
                
                form.reset();
                
                // Success effect
                glitchSystem.triggerGlitch();
            }
        });
    }
}

// === VISITOR COUNTER ===

function initCounters() {
    document.querySelectorAll('[data-counter]').forEach(counter => {
        const target = parseInt(counter.textContent) || 0;
        let current = 0;
        
        const increment = () => {
            if (current < target) {
                current += randomInt(1, 100);
                if (current > target) current = target;
                counter.textContent = current.toString().padStart(6, '0');
                requestAnimationFrame(increment);
            }
        };
        
        // Start counting when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    increment();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// === GLOBAL EVENT LISTENERS ===

function initGlobalEvents() {
    // Random screen flicker
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 5000);
}

// === INITIALIZATION ===

let screenManager;
let glitchSystem;
let terminal;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    screenManager = new ScreenManager();
    glitchSystem = new GlitchSystem();
    terminal = new Terminal();
    
    // Initialize effects
    initScrambleTexts();
    initDatabaseInteractions();
    initHiddenContent();
    initNavigation();
    initCoreGuestbook();
    initCounters();
    initGlobalEvents();
    
    // Start boot sequence
    const bootSequence = new BootSequence(() => {
        // After boot, start periodic glitches
        glitchSystem.startPeriodicGlitches();
    });
});
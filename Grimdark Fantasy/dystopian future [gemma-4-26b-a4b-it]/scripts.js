/**
 * NEURO-GOTHIC OS // CORE_LOGIC.js
 * Purpose: Immersive terminal behavior and interactive command processing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const CONFIG = {
        LOG_INTERVAL: 4000,
        STREAM_INTERVAL: 1500,
        GLITCH_CHANCE: 0.05, // 5% chance per tick
        COMMAND_DELAY: 500
    };

    const state = {
        isGlitching: false,
        terminalActive: true,
        currentUser: 'root'
    };

    // --- DOM Elements ---
    const elements = {
        logStream: document.getElementById('log-stream'),
        dataStream: document.getElementById('data-stream-content'),
        cmdInput: document.getElementById('cmd-input'),
        glitchOverlay: document.getElementById('glitch-overlay'),
        appContainer: document.getElementById('app-container')
    };

    // --- Mock Data ---
    const LOG_MESSAGES = [
        "Connection established via Sector 7 relay.",
        "Packet intercept: [REDACTED] protocol detected.",
        "Warning: Aegis firewall scanning local subnet.",
        "Node 04 offline. Possible physical breach.",
        "Signal strength dropping... recalibrating.",
        "Decrypting neural-link handshake...",
        "Found trace of 'The Hollowed' in subnet.",
        "ERROR: Unauthorized access attempt detected.",
        "Ghost signal detected on frequency 44.9",
        "Bypassing bio-metric lockout..."
    ];

    const DATA_STREAM_LINES = [
        "0x4F_A2_BC", "ERR_VOID_NULL", "SIG_LOSS_44%", "DECRYPTING...", 
        "CORE_OVERLOAD", "AUTH_FAIL", "DATA_LEAK_DETECTED", "SYNC_ERR",
        "MEM_DUMP_0x00", "NULL_POINTER", "PROTOCOL_X_INIT"
    ];

    // --- Core Systems ---

    /**
     * Adds a new entry to the Uplink Log
     */
    const addLog = (message) => {
        const now = new Date();
        const timestamp = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        const li = document.createElement('li');
        li.textContent = `${timestamp} ${message}`;
        
        // Add new log to top or bottom? Let's add to top for a "latest news" feel
        elements.logStream.prepend(li);

        // Keep log size manageable
        if (elements.logStream.children.length > 15) {
            elements.logStream.removeChild(elements.logStream.lastChild);
        }
    };

    /**
     * Adds a line to the scrolling Data Stream
     */
    const addStreamLine = () => {
        const line = document.createElement('div');
        line.className = 'stream-line';
        line.textContent = DATA_STREAM_LINES[Math.floor(Math.random() * DATA_STREAM_LINES.length)];
        
        elements.dataStream.appendChild(line);

        if (elements.dataStream.children.length > 20) {
            elements.dataStream.removeChild(elements.dataStream.firstChild);
        }
    };

    /**
     * Triggers a visual glitch/propaganda event
     */
    const triggerGlitch = () => {
        if (state.isGlitching) return;

        state.isGlitching = true;
        elements.glitchOverlay.classList.remove('hidden');
        
        // Simulate a "system reboot" or "hacked" feel
        elements.appContainer.style.filter = "invert(1) hue-rotate(180deg)";
        
        setTimeout(() => {
            elements.glitchOverlay.classList.add('hidden');
            elements.appContainer.style.filter = "none";
            state.isGlitching = false;
        }, 150 + Math.random() * 300);
    };

    /**
     * Command Line Interpreter
     */
    const processCommand = (input) => {
        const cmd = input.toLowerCase().trim();
        const responseArea = elements.logStream;

        // Add the command itself to the log to show history
        addLog(`> ${input}`);

        switch(cmd) {
            case 'help':
                addLog("Available: [status, scan, clear, locate, exit]");
                break;
            case 'status':
                addLog("SYS_HEALTH: 42% | CORE_TEMP: CRITICAL | UPLINK: UNSTABLE");
                break;
            case 'scan':
                addLog("Scanning local sector...");
                setTimeout(() => addLog("SCAN_COMPLETE: No Aegis patrols in immediate vicinity."), 1500);
                break;
            case 'clear':
                elements.logStream.innerHTML = '';
                elements.dataStream.innerHTML = '';
                addLog("Terminal cleared.");
                break;
            case 'locate':
                addLog("Locating resistance node...");
                setTimeout(() => addLog("NODE_FOUND: Sector 4, Sub-level 9."), 2000);
                break;
            case 'exit':
                addLog("Terminating session... Connection lost.");
                state.terminalActive = false;
                break;
            default:
                addLog(`Unknown command: '${cmd}'`);
                break;
        }
    };

    // --- Initialization & Loops ---

    const init = () => {
        // Start background processes
        setInterval(() => {
            // Random Logs
            if (Math.random() > 0.7) {
                addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
            }
        }, CONFIG.LOG_INTERVAL);

        setInterval(addStreamLine, CONFIG.STREAM_INTERVAL);

        // The Glitch Loop
        const glitchLoop = () => {
            if (Math.random() < CONFIG.GLITCH_CHANCE) {
                triggerGlitch();
            }
            setTimeout(glitchLoop, 2000);
        };
        glitchLoop();

        // Event Listeners
        elements.cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && state.terminalActive) {
                const val = elements.cmdInput.value;
                processCommand(val);
                elements.cmdInput.value = '';
            }
        });

        // Initial greeting
        setTimeout(() => {
            addLog("NEURO-GOTHIC OS v0.9.4 Boot Sequence Complete.");
            addLog("Awaiting user input...");
        }, 1000);
    };

    init();
});
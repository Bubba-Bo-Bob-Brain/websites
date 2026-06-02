// --- NEO-GRID CYBERNETIC DECK INTERACTIVE SCRIPTS ---

document.addEventListener('DOMContentLoaded', () => {
    // State Controller
    const STATE = {
        bootComplete: false,
        uptime: 0,
        cpuLoad: 42,
        ramUsage: 78,
        activeNode: null,
        decryptionProgress: 0,
        isDecrypting: false,
        isScanning: false,
        targetList: [
            { host: "Nakamoto_Vault_01", security: "MILITARY_GRADE", enc: "AES-256-GCM", coords: "35.6762, 139.6503" },
            { host: "Arasaka_Subnet_09", security: "HIGH_SECURE", enc: "SHA-512-RSA", coords: "35.6895, 139.6917" },
            { host: "Weyland_Core_D", security: "CLASSIFIED", enc: "CHACHA20-POLY", coords: "45.5017, -73.5673" },
            { host: "Wey-Yut_Mainframe", security: "MAX_SECURE", enc: "ROT-X9_QUANTUM", coords: "-33.8688, 151.2093" },
            { host: "Orbital_Theta_0", security: "CRITICAL_INFRA", enc: "BLOWFISH_2X", coords: "0.0000, 0.0000" }
        ],
        currentTargetIndex: 0
    };

    // --- DOM ELEMENT REFERENCES ---
    const bootScreen = document.getElementById('bootScreen');
    const bootLog = document.getElementById('bootLog');
    const bootProgressBar = document.getElementById('bootProgressBar');
    const bypassBtn = document.getElementById('bypassBtn');
    
    const matrixCanvas = document.getElementById('matrix-canvas');
    const dataStreamCanvas = document.getElementById('dataStreamCanvas');
    
    const nodeGrid = document.getElementById('nodeGrid');
    const hexDump = document.getElementById('hexDump');
    
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    
    const cpuFill = document.getElementById('cpuFill');
    const cpuVal = document.getElementById('cpuVal');
    const ramFill = document.getElementById('ramFill');
    const ramVal = document.getElementById('ramVal');
    
    const nodeAddress = document.getElementById('nodeAddress');
    const gridCoordinates = document.getElementById('gridCoordinates');
    const uptimeCounter = document.getElementById('uptimeCounter');
    
    const targetHost = document.getElementById('targetHost');
    const targetSecurity = document.getElementById('targetSecurity');
    const targetEncryption = document.getElementById('targetEncryption');
    const decryptMeter = document.getElementById('decryptMeter');
    
    const breachBtn = document.getElementById('breachBtn');
    const scanBtn = document.getElementById('scanBtn');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const statusMessage = document.getElementById('statusMessage');

    // --- BOOT SEQUENCE INTERACTIVE ENGINE ---
    const bootMessages = [
        { text: "INITIALIZING DECK NEURAL INTERFACE...", delay: 200, type: "log-success" },
        { text: "STABLIZING HYDRO-COOLANT PUMPS... OK", delay: 400, type: "log-success" },
        { text: "ESTABLISHING PROXY CHAINS... 9 NODES IN PLACE", delay: 300, type: "log-success" },
        { text: "WARNING: QUANTUM BREACH PROTOCOL NOT CALIBRATED", delay: 500, type: "log-warn" },
        { text: "ATTEMPTING TO INJECT PACKETS INTO TARGET UPLINK...", delay: 400, type: "log-success" },
        { text: "BYPASSING FIREWALL... SUCCESS", delay: 300, type: "log-success" },
        { text: "NEO-GRID OS V7.92 ONLINE", delay: 200, type: "log-success" }
    ];

    let logIndex = 0;
    let progressInterval;

    function runBootSequence() {
        if (logIndex < bootMessages.length) {
            const msg = bootMessages[logIndex];
            const p = document.createElement('div');
            p.className = `log-entry ${msg.type}`;
            p.textContent = `[SYS] ${msg.text}`;
            bootLog.appendChild(p);
            bootLog.scrollTop = bootLog.scrollHeight;
            
            // Increment progress bar relative to steps
            const progressPct = ((logIndex + 1) / bootMessages.length) * 100;
            bootProgressBar.style.width = `${progressPct}%`;
            
            logIndex++;
            setTimeout(runBootSequence, msg.delay + Math.random() * 200);
        } else {
            setTimeout(completeBoot, 600);
        }
    }

    function completeBoot() {
        clearInterval(progressInterval);
        bootScreen.classList.add('loaded');
        STATE.bootComplete = true;
        terminalInput.focus();
        updateStatus("Cybernetic deck online. Neural uplink stable.");
    }

    bypassBtn.addEventListener('click', () => {
        completeBoot();
    });

    // Start boot sequence
    runBootSequence();


    // --- MATRIX DIGITAL RAIN ---
    const ctx = matrixCanvas.getContext('2d');
    function resizeMatrixCanvas() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
    resizeMatrixCanvas();
    window.addEventListener('resize', resizeMatrixCanvas);

    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ10";
    const charArr = chars.split("");
    const fontSize = 14;
    let columns = matrixCanvas.width / fontSize;
    let drops = [];

    function initDrops() {
        columns = matrixCanvas.width / fontSize;
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    }
    initDrops();
    window.addEventListener('resize', initDrops);

    function drawMatrix() {
        ctx.fillStyle = "rgba(4, 8, 4, 0.08)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        ctx.fillStyle = "#39ff14";
        ctx.font = fontSize + "px 'Share Tech Mono'";
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArr[Math.floor(Math.random() * charArr.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 35);


    // --- TELEMETRY & STATUS UPDATE ---
    setInterval(() => {
        if (!STATE.bootComplete) return;
        
        // Uptime Tick
        STATE.uptime++;
        const hrs = String(Math.floor(STATE.uptime / 3600)).padStart(2, '0');
        const mins = String(Math.floor((STATE.uptime % 3600) / 60)).padStart(2, '0');
        const secs = String(STATE.uptime % 60).padStart(2, '0');
        uptimeCounter.textContent = `${hrs}:${mins}:${secs}`;

        // CPU & RAM Fluctuation
        STATE.cpuLoad = Math.min(100, Math.max(5, STATE.cpuLoad + (Math.floor(Math.random() * 11) - 5)));
        STATE.ramUsage = Math.min(100, Math.max(10, STATE.ramUsage + (Math.floor(Math.random() * 5) - 2)));

        cpuFill.style.width = `${STATE.cpuLoad}%`;
        cpuVal.textContent = `${STATE.cpuLoad}%`;
        ramFill.style.width = `${STATE.ramUsage}%`;
        ramVal.textContent = `${STATE.ramUsage}%`;

        // Update target visual system indicators randomly
        if (Math.random() > 0.85) {
            nodeAddress.textContent = "X9-" + Math.floor(Math.random() * 900 + 100) + "-FLUX";
        }
    }, 1000);

    function updateStatus(msg) {
        statusMessage.textContent = msg;
    }


    // --- INTERACTIVE NODE MAP GRID ---
    const totalNodes = 24;
    function createNodeMap() {
        nodeGrid.innerHTML = '';
        for (let i = 0; i < totalNodes; i++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.textContent = String(i).padStart(2, '0');
            node.dataset.nodeId = i;
            
            node.addEventListener('click', () => {
                selectNode(node);
            });

            nodeGrid.appendChild(node);
        }
    }
    createNodeMap();

    function selectNode(nodeEl) {
        const id = nodeEl.dataset.nodeId;
        
        // Remove active state from others
        document.querySelectorAll('.node').forEach(n => {
            if (!n.classList.contains('breached')) {
                n.classList.remove('active');
            }
        });

        if (!nodeEl.classList.contains('breached')) {
            nodeEl.classList.add('active');
            STATE.activeNode = id;
            writeTerminalLine(`TUNNEL LINK STAGED WITH NODE [${id}]`, 'command');
            updateStatus(`Tethered connection established on proxy node ${id}`);
        } else {
            writeTerminalLine(`CANNOT RE-STAGED BREACHED NODE [${id}]`, 'error');
        }
    }


    // --- REALTIME RAM DUMP GENERATION ---
    const hexChars = "0123456789ABCDEF";
    function generateHexRow() {
        let addr = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
        let hex = '';
        for (let i = 0; i < 8; i++) {
            hex += hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + ' ';
        }
        let ascii = '';
        for (let i = 0; i < 8; i++) {
            const code = Math.floor(Math.random() * (126 - 33)) + 33;
            ascii += String.fromCharCode(code);
        }
        return `${addr}:  ${hex} | ${ascii}`;
    }

    function initHexDump() {
        hexDump.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const row = document.createElement('div');
            row.textContent = generateHexRow();
            hexDump.appendChild(row);
        }
    }
    initHexDump();

    setInterval(() => {
        if (!STATE.bootComplete) return;
        const row = document.createElement('div');
        row.textContent = generateHexRow();
        hexDump.appendChild(row);
        if (hexDump.childNodes.length > 15) {
            hexDump.removeChild(hexDump.firstChild);
        }
    }, 250);


    // --- CENTRAL TERMINAL ENGINE ---
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim();
            if (inputVal !== "") {
                handleCommand(inputVal);
                terminalInput.value = "";
            }
        }
    });

    function writeTerminalLine(text, styleClass = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line ' + styleClass;
        line.innerHTML = text;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    const commandRegistry = {
        help: () => {
            writeTerminalLine("--- DIRECTIVE MANIFEST ---", "text-highlight");
            writeTerminalLine("<span class='text-highlight'>help</span>       - Displays system commands database.");
            writeTerminalLine("<span class='text-highlight'>scan</span>       - Initiates multi-spectral ping across target subnets.");
            writeTerminalLine("<span class='text-highlight'>decrypt</span>    - Attacks current database lock with Quantum Breach algorithm.");
            writeTerminalLine("<span class='text-highlight'>status</span>     - Reports general diagnostics and target information.");
            writeTerminalLine("<span class='text-highlight'>clear</span>      - Flushes active terminal display cache.");
            writeTerminalLine("<span class='text-highlight'>node [id]</span>  - Force binds network proxy to designated node (00-23).");
            writeTerminalLine("<span class='text-highlight'>emergency</span>  - Triggers tactical neural disconnect protocol.");
        },
        scan: () => {
            triggerPortScan();
        },
        decrypt: () => {
            triggerDecryption();
        },
        status: () => {
            writeTerminalLine("--- CURRENT SYSTEM TELEMETRY ---", "text-highlight");
            writeTerminalLine(`ACTIVE INTERRUPT: Node [${STATE.activeNode !== null ? STATE.activeNode : 'NONE'}]`);
            writeTerminalLine(`CPU UTILIZATION:  ${STATE.cpuLoad}%`);
            writeTerminalLine(`MEMORY BUFFER:    ${STATE.ramUsage}%`);
            writeTerminalLine(`DECRYPT INTEGRITY: ${STATE.decryptionProgress}%`);
            writeTerminalLine(`CURRENT TARGET:   ${STATE.targetList[STATE.currentTargetIndex].host}`);
        },
        clear: () => {
            terminalBody.innerHTML = '';
        },
        emergency: () => {
            triggerEmergencyDisconnect();
        }
    };

    function handleCommand(cmdStr) {
        writeTerminalLine(`netrunner@neogrid:~# ${cmdStr}`, 'command');
        
        const args = cmdStr.toLowerCase().split(' ');
        const baseCmd = args[0];

        if (commandRegistry[baseCmd]) {
            commandRegistry[baseCmd]();
        } else if (baseCmd === 'node') {
            const nodeId = parseInt(args[1], 10);
            if (!isNaN(nodeId) && nodeId >= 0 && nodeId < totalNodes) {
                const nodes = document.querySelectorAll('.node');
                const targetNode = nodes[nodeId];
                selectNode(targetNode);
            } else {
                writeTerminalLine("ERROR: NODE DESIGNATOR OUT OF BOUNDS. USE SPECIFICATION [00-23]", "error");
            }
        } else {
            writeTerminalLine(`ERR: DIRECTIVE "${cmdStr}" NOT RECOGNIZED BY NETWORK COPROCESSOR`, 'error');
        }
    }


    // --- DATA STREAM SINE-WAVE VISUALIZER ---
    const dsCtx = dataStreamCanvas.getContext('2d');
    let phase = 0;

    function resizeDataStream() {
        dataStreamCanvas.width = dataStreamCanvas.parentElement.clientWidth;
        dataStreamCanvas.height = dataStreamCanvas.parentElement.clientHeight;
    }
    resizeDataStream();
    window.addEventListener('resize', resizeDataStream);

    function drawDataStream() {
        dsCtx.clearRect(0, 0, dataStreamCanvas.width, dataStreamCanvas.height);
        
        // Draw grid
        dsCtx.strokeStyle = "rgba(57, 255, 20, 0.05)";
        dsCtx.lineWidth = 1;
        const spacing = 10;
        for (let x = 0; x < dataStreamCanvas.width; x += spacing) {
            dsCtx.beginPath();
            dsCtx.moveTo(x, 0);
            dsCtx.lineTo(x, dataStreamCanvas.height);
            dsCtx.stroke();
        }
        for (let y = 0; y < dataStreamCanvas.height; y += spacing) {
            dsCtx.beginPath();
            dsCtx.moveTo(0, y);
            dsCtx.lineTo(dataStreamCanvas.width, y);
            dsCtx.stroke();
        }

        // Draw sine waves representing dynamic data flows
        dsCtx.strokeStyle = "#39ff14";
        dsCtx.lineWidth = 2;
        dsCtx.beginPath();
        for (let x = 0; x < dataStreamCanvas.width; x++) {
            const y = dataStreamCanvas.height / 2 + 
                      Math.sin(x * 0.02 + phase) * 20 + 
                      Math.sin(x * 0.01 - phase * 0.5) * 10;
            if (x === 0) dsCtx.moveTo(x, y);
            else dsCtx.lineTo(x, y);
        }
        dsCtx.stroke();

        // Second wave (out of phase, red if decrypting, orange otherwise)
        dsCtx.strokeStyle = STATE.isDecrypting ? "#ff2a5f" : "#ffb000";
        dsCtx.lineWidth = 1.5;
        dsCtx.beginPath();
        for (let x = 0; x < dataStreamCanvas.width; x++) {
            const y = dataStreamCanvas.height / 2 + 
                      Math.cos(x * 0.03 - phase * 1.5) * 15 + 
                      Math.sin(x * 0.01 + phase) * 8;
            if (x === 0) dsCtx.moveTo(x, y);
            else dsCtx.lineTo(x, y);
        }
        dsCtx.stroke();

        phase += STATE.isDecrypting ? 0.25 : 0.06;
        requestAnimationFrame(drawDataStream);
    }
    drawDataStream();


    // --- INTERACTIVE ACTIONS & SIMULATIONS ---

    function triggerPortScan() {
        if (STATE.isScanning) return;
        STATE.isScanning = true;
        writeTerminalLine("INITIATING PORT SCANNER ACROSS NEURAL TARGET BUFFER...", "text-highlight");
        updateStatus("Scanning host environment ports...");
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            writeTerminalLine(`PORT STAGE: PINGING HOST NODE SUBSETS... ${progress}%`, "text-highlight");
            
            // Randomly flash nodes during scan
            const randomNode = document.querySelectorAll('.node')[Math.floor(Math.random() * totalNodes)];
            if (randomNode && !randomNode.classList.contains('breached')) {
                randomNode.classList.add('active');
                setTimeout(() => randomNode.classList.remove('active'), 150);
            }

            if (progress >= 100) {
                clearInterval(interval);
                STATE.isScanning = false;
                
                // Advance current target index
                STATE.currentTargetIndex = (STATE.currentTargetIndex + 1) % STATE.targetList.length;
                const currentTarget = STATE.targetList[STATE.currentTargetIndex];
                
                // Update Target profile UI
                targetHost.textContent = currentTarget.host;
                targetSecurity.textContent = currentTarget.security;
                targetEncryption.textContent = currentTarget.enc;
                gridCoordinates.textContent = currentTarget.coords;
                
                // Reset decryption visual
                STATE.decryptionProgress = 0;
                decryptMeter.style.width = '0%';

                writeTerminalLine("PORT SCAN COMPLETED successfully.", "success");
                writeTerminalLine(`TARGET ACQUIRED: ${currentTarget.host} | SEC: ${currentTarget.security}`, "success");
                updateStatus(`Ready to mount cybernetic attack vectors on ${currentTarget.host}.`);
            }
        }, 400);
    }

    function triggerDecryption() {
        if (STATE.isDecrypting) return;
        if (STATE.decryptionProgress >= 100) {
            writeTerminalLine("TARGET FILE SYSTEM ALREADY COMPROMISED. RE-SCAN TO RESET INTEGRITY LOCK.", "error");
            return;
        }

        STATE.isDecrypting = true;
        writeTerminalLine("MOUNTING QUANTUM SHIFT DECRYPTION ATTACK...", "text-highlight");
        updateStatus("Compromising firewall segments...");

        const interval = setInterval(() => {
            STATE.decryptionProgress += Math.floor(Math.random() * 8) + 4;
            if (STATE.decryptionProgress > 100) STATE.decryptionProgress = 100;
            
            decryptMeter.style.width = `${STATE.decryptionProgress}%`;
            writeTerminalLine(`CORRUPTING PARITY CODES... SYNERGISTIC MATCH AT ${STATE.decryptionProgress}%`, "text-highlight");

            // Flash active nodes to visually link the breach
            if (STATE.activeNode !== null) {
                const activeEl = document.querySelector(`.node[data-node-id='${STATE.activeNode}']`);
                if (activeEl) {
                    activeEl.classList.toggle('active');
                }
            }

            if (STATE.decryptionProgress >= 100) {
                clearInterval(interval);
                STATE.isDecrypting = false;
                
                writeTerminalLine("--- ACCESS GRANTED ---", "success");
                writeTerminalLine(`CORE FILESYSTEM BREACHED ON ${STATE.targetList[STATE.currentTargetIndex].host}!`, "success");
                updateStatus("TARGET DATA EXTRALATION PERMITTED. SYSTEM COMPROMISED.");

                // Turn the active node (if any) to breached state
                if (STATE.activeNode !== null) {
                    const activeEl = document.querySelector(`.node[data-node-id='${STATE.activeNode}']`);
                    if (activeEl) {
                        activeEl.classList.remove('active');
                        activeEl.classList.add('breached');
                    }
                }
            }
        }, 500);
    }

    function triggerEmergencyDisconnect() {
        writeTerminalLine("!!! INITIATING TOTAL NEURAL SYSTEM SHUTDOWN DISCONNECT !!!", "error");
        updateStatus("CRITICAL EMERGENCY DISCONNECT ACTUATED!");
        
        document.body.style.filter = "invert(1) hue-rotate(90deg)";
        setTimeout(() => {
            document.body.style.filter = "none";
            // Re-lock to boot screen
            STATE.bootComplete = false;
            bootScreen.classList.remove('loaded');
            bootLog.innerHTML = '';
            bootProgressBar.style.width = '0%';
            logIndex = 0;
            runBootSequence();
        }, 1200);
    }

    // Button Listeners
    scanBtn.addEventListener('click', triggerPortScan);
    breachBtn.addEventListener('click', triggerDecryption);
    emergencyBtn.addEventListener('click', triggerEmergencyDisconnect);
});
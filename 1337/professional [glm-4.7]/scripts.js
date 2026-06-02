document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const BOOT_TEXT_SPEED = 30; // ms per char
    const LOG_UPDATE_SPEED = 800; // ms per log entry
    
    // --- DOM ELEMENTS ---
    const bootTextContainer = document.getElementById('boot-text');
    const accessBtn = document.getElementById('access-btn');
    const dashboardSection = document.getElementById('dashboard');
    const intelSection = document.getElementById('intel');
    const decryptSection = document.getElementById('decrypt');
    const heroSection = document.getElementById('hero');
    const packetLog = document.getElementById('packet-log');
    const sysTime = document.getElementById('sys-time');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const attacksCounter = document.getElementById('attacks-per-hour');

    // --- STATE ---
    let isSystemActive = false;
    let logInterval;
    let clockInterval;

    // --- UTILITIES ---
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomIP = () => `${randomInt(10, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
    const getTimestamp = () => {
        const now = new Date();
        return now.toISOString().split('T')[1].split('.')[0];
    };

    // --- BOOT SEQUENCE ---
    const bootMessages = [
        "Initializing kernel v5.14.0-zero_day...",
        "Loading cryptographic modules...",
        "Mounting virtual file system...",
        "Establishing secure handshake with server...",
        "Bypassing proxy [192.168.0.1]...",
        "Decrypting user credentials...",
        "Scanning for vulnerabilities...",
        "THREAT DETECTED: Port 445 (SMB) open.",
        "Applying security patches...",
        "SYSTEM READY."
    ];

    const typeWriter = (text, element, callback) => {
        let i = 0;
        const line = document.createElement('div');
        element.insertBefore(line, element.lastElementChild); // Insert before cursor
        
        function type() {
            if (i < text.length) {
                line.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, BOOT_TEXT_SPEED);
            } else {
                line.innerHTML += '<br/>';
                if (callback) callback();
            }
        }
        type();
    };

    const runBootSequence = () => {
        let index = 0;
        
        function nextLine() {
            if (index < bootMessages.length) {
                typeWriter(bootMessages[index], bootTextContainer, () => {
                    index++;
                    setTimeout(nextLine, 200);
                });
            } else {
                // Boot complete
                accessBtn.classList.remove('hidden');
                accessBtn.classList.add('blink');
            }
        }
        nextLine();
    };

    // --- DASHBOARD ACTIVATION ---
    accessBtn.addEventListener('click', () => {
        isSystemActive = true;
        
        // Hide Hero, Show Dashboard
        heroSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        intelSection.classList.remove('hidden');
        decryptSection.classList.remove('hidden');

        // Start Modules
        startClock();
        startPacketLog();
        initThreatMap();
        
        // Scroll to top
        window.scrollTo(0,0);
    });

    // --- CLOCK ---
    const startClock = () => {
        const update = () => {
            const now = new Date();
            sysTime.innerText = now.toISOString().split('T')[1].split('.')[0] + " UTC";
            
            // Randomly fluctuate attack counter
            if (Math.random() > 0.7) {
                let current = parseInt(attacksCounter.innerText);
                let change = randomInt(-50, 150);
                attacksCounter.innerText = Math.max(0, current + change);
                // Visual alert if spike
                if (change > 100) {
                    attacksCounter.style.textShadow = "0 0 10px red";
                    setTimeout(() => attacksCounter.style.textShadow = "none", 500);
                }
            }
        };
        update();
        clockInterval = setInterval(update, 1000);
    };

    // --- PACKET LOG ---
    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'FTP'];
    const flags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH'];
    const types = ['INFO', 'WARN', 'CRIT', 'INFO', 'INFO']; // Weighted towards INFO

    const startPacketLog = () => {
        const addLog = () => {
            const li = document.createElement('li');
            const type = types[randomInt(0, types.length - 1)];
            const proto = protocols[randomInt(0, protocols.length - 1)];
            const src = randomIP();
            const dst = randomIP();
            const port = randomInt(20, 65000);
            
            li.innerHTML = `
                <span class="timestamp">[${getTimestamp()}]</span>
                <span class="type ${type}">${type}</span>
                <span class="details">${proto} ${src}:${port} > ${dst} [${flags[randomInt(0, flags.length - 1)]}]</span>
            `;
            
            packetLog.prepend(li);
            
            // Keep list short
            if (packetLog.children.length > 20) {
                packetLog.removeChild(packetLog.lastChild);
            }
        };
        addLog(); // Initial
        logInterval = setInterval(addLog, LOG_UPDATE_SPEED);
    };

    // --- THREAT MAP (CANVAS) ---
    const initThreatMap = () => {
        const canvas = document.getElementById('threatMap');
        const ctx = canvas.getContext('2d');
        
        let width, height;
        
        const resize = () => {
            const parent = canvas.parentElement;
            width = parent.clientWidth;
            height = 300; // Fixed height from CSS
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Nodes
        const nodes = [];
        const nodeCount = 30;
        for(let i=0; i<nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        // Attacks (Red pulses)
        const attacks = [];

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
            ctx.fillRect(0, 0, width, height);

            // Draw Grid Lines (Map background)
            ctx.strokeStyle = '#112211';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x=0; x<width; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,height); }
            for(let y=0; y<height; y+=40) { ctx.moveTo(0,y); ctx.lineTo(width,y); }
            ctx.stroke();

            // Update & Draw Nodes
            ctx.fillStyle = '#00ff41';
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if(node.x < 0 || node.x > width) node.vx *= -1;
                if(node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                nodes.forEach(other => {
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 80) {
                        ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist/80})`;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                });
            });

            // Handle Attacks
            if (Math.random() < 0.05) {
                const source = nodes[randomInt(0, nodes.length - 1)];
                const target = nodes[randomInt(0, nodes.length - 1)];
                attacks.push({
                    sx: source.x, sy: source.y,
                    tx: target.x, ty: target.y,
                    progress: 0,
                    speed: 0.02 + Math.random() * 0.03
                });
            }

            for (let i = attacks.length - 1; i >= 0; i--) {
                const atk = attacks[i];
                atk.progress += atk.speed;
                
                const currX = atk.sx + (atk.tx - atk.sx) * atk.progress;
                const currY = atk.sy + (atk.ty - atk.sy) * atk.progress;

                ctx.fillStyle = '#ff3333';
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'red';
                ctx.beginPath();
                ctx.arc(currX, currY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                if (atk.progress >= 1) {
                    attacks.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };
        animate();
    };

    // --- CLI / DECRYPTOR ---
    const fileSystem = [
        { name: 'quantum_decrypt.pdf', size: '4MB', access: 'RESTRICTED' },
        { name: 'kernel_exploit.c', size: '12KB', access: 'TOP SECRET' },
        { name: 'network_logs.dat', size: '2GB', access: 'PUBLIC' },
        { name: 'agent_manifest.txt', size: '1KB', access: 'CONFIDENTIAL' }
    ];

    const handleCommand = (cmd) => {
        const parts = cmd.trim().toLowerCase().split(' ');
        const command = parts[0];
        const arg = parts[1];
        
        let response = '';

        switch(command) {
            case 'help':
                response = `
                    <span class="command-line">AVAILABLE COMMANDS:</span><br>
                    > help     : Show this list<br>
                    > ls       : List directory contents<br>
                    > clear    : Clear terminal<br>
                    > date     : Show system date<br>
                    > whoami   : Show current user<br>
                    > decrypt  : Attempt to decrypt file (usage: decrypt [filename])
                `;
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                return; // Skip appending response
            case 'ls':
                let output = '<span class="command-line">DIRECTORY LISTING:</span><br>';
                fileSystem.forEach(f => {
                    output += `<span class="${f.access === 'TOP SECRET' ? 'text-alert' : 'text-neon'}">${f.access}</span>  ${f.name}  (${f.size})<br>`;
                });
                response = output;
                break;
            case 'date':
                response = `System Date: ${new Date().toString()}`;
                break;
            case 'whoami':
                response = `uid=0(root) gid=0(root) groups=0(root)`;
                break;
            case 'decrypt':
                if (!arg) {
                    response = '<span class="text-alert">ERROR: No file specified.</span>';
                } else {
                    const file = fileSystem.find(f => f.name.toLowerCase() === arg.toLowerCase());
                    if (file) {
                        if (file.access === 'PUBLIC') {
                            response = `<span class="text-neon">SUCCESS: ${file.name} downloaded.</span>`;
                        } else {
                            response = `<span class="text-alert">ACCESS DENIED: Encryption level too high for guest privileges.</span>`;
                        }
                    } else {
                        response = `<span class="text-alert">ERROR: File not found.</span>`;
                    }
                }
                break;
            default:
                if (command === '') return;
                response = `<span class="text-alert">Command not found: ${command}</span>`;
        }

        // Append Command
        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<span class="prompt">guest@zero-day:~$</span> ${cmd}`;
        cliOutput.appendChild(cmdLine);

        // Append Response
        const respLine = document.createElement('div');
        respLine.className = 'response-line';
        respLine.innerHTML = response;
        cliOutput.appendChild(respLine);

        // Scroll to bottom
        cliOutput.scrollTop = cliOutput.scrollHeight;
    };

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(cliInput.value);
            cliInput.value = '';
        }
    });

    // --- INITIAL BOOT ---
    runBootSequence();

    // --- RANDOM GLITCH EFFECT ---
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.textShadow = '2px 0 red, -2px 0 blue';
            setTimeout(() => {
                document.body.style.textShadow = 'none';
            }, 100);
        }
    }, 2000);

});
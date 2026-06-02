// ===== STATE MANAGEMENT =====
const state = {
    currentLayer: 'boot-sequence',
    fragmentsFound: 0,
    totalFragments: 4,
    mazePlayerPos: { x: 0, y: 0 },
    mazeFragments: [],
    terminalHistory: [],
    sanctuaryFound: false,
    bootComplete: false
};

// ===== LAYER NAVIGATION =====
function showLayer(layerId) {
    document.querySelectorAll('.layer').forEach(layer => {
        layer.classList.remove('active');
    });
    const target = document.getElementById(layerId);
    if (target) {
        target.classList.add('active');
        state.currentLayer = layerId;
    }
}

// ===== BOOT SEQUENCE =====
const bootMessages = [
    'BIOS DATE 01/01/70 00:00:00 VER 0.0.0',
    'CPU: CORRUPTED PROCESSOR @ 0.00MHz',
    '640K RAM SYSTEM... 64K OK',
    '',
    'AWARD MODULAR BIOS v0.0.0, AN ENERGY STAR ALLY',
    'COPYRIGHT (C) 1970-????, AWARD SOFTWARE, INC.',
    '',
    'PNP INITIATION... [FAILED]',
    'DETECTING HDD PRIMARY MASTER ... [NONE]',
    'DETECTING HDD PRIMARY SLAVE ... [CORRUPTED]',
    '',
    'LOADING OPERATING SYSTEM...',
    'ERROR: BOOT SECTOR UNREADABLE',
    'ATTEMPTING RECOVERY FROM ALTERNATE SOURCE...',
    '',
    '................................................',
    'WARNING: FILESYSTEM INTEGRITY COMPROMISED',
    'WARNING: MULTIPLE BAD SECTORS DETECTED',
    'WARNING: TIME/DATE NOT SET',
    '',
    'MOUNTING VIRTUAL FILESYSTEM ... [OK]',
    'LOADING NETRUINS_KERNEL ... [OK]',
    'INITIALIZING DECAY MODULES ... [OK]',
    '',
    ' _   _      _ _         _',
    '| \\ | |    | | |       | |',
    '|  \\| | ___| | | ___   | | ___ _   _ _ __ ___',
    '| . ` |/ _ \\ | |/ _ \\  | |/ _ \\ | | | \'_ ` _ \\',
    '| |\\  |  __/ | | (_) | | |  __/ |_| | | | | | |',
    '\\_| \\_/\\___|_|_|\\___/  |_|\\___|\\__,_|_| |_| |_|',
    '',
    'BUILD 0.0.0-UNSTABLE // FOREVER BETA',
    '',
    'ESTABLISHING CONNECTION TO HOST...',
    '................................................',
    '................................................',
    '',
    'CONNECTION UNSTABLE. PROCEED WITH CAUTION.',
    '',
    'PRESS ANY KEY TO ENTER THE RUINS...'
];

function runBootSequence() {
    const bootText = document.querySelector('.boot-text');
    let messageIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
        if (messageIndex >= bootMessages.length) {
            state.bootComplete = true;
            return;
        }

        const currentMessage = bootMessages[messageIndex];

        if (charIndex === 0) {
            bootText.textContent += '\n';
        }

        if (charIndex < currentMessage.length) {
            bootText.textContent += currentMessage[charIndex];
            charIndex++;
            const delay = Math.random() * 30 + 10;
            setTimeout(typeNextChar, delay);
        } else {
            messageIndex++;
            charIndex = 0;
            const lineDelay = Math.random() * 200 + 50;
            setTimeout(typeNextChar, lineDelay);
        }
    }

    setTimeout(typeNextChar, 500);
}

// ===== HOMEPAGE INTERACTIONS =====
function initHomepage() {
    const navLinks = document.querySelectorAll('.nav-link');
    const deadLinks = document.querySelectorAll('.dead-link');
    const webringLinks = document.querySelectorAll('.webring-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const dest = link.dataset.dest;

            if (link.classList.contains('dead-link')) {
                showDeadLinkPopup(link.textContent);
                return;
            }

            switch(dest) {
                case 'about':
                    showSystemAlert('About page corrupted. Redirecting to error handler...');
                    setTimeout(() => showLayer('error-404'), 1500);
                    break;
                case 'gallery':
                    showLayer('loading-page');
                    runFakeLoading();
                    break;
                case 'downloads':
                    showLayer('database-page');
                    populateDatabase();
                    break;
                case 'contact':
                    showSystemAlert('Contact form infected. Opening safe mode terminal...');
                    setTimeout(() => {
                        showLayer('terminal-page');
                        document.getElementById('terminal-input').focus();
                    }, 1500);
                    break;
                case 'null':
                    showDeadLinkPopup(link.textContent);
                    break;
            }
        });
    });

    deadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showDeadLinkPopup(link.textContent);
        });
    });

    webringLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showDeadLinkPopup('webring.neocities.org');
        });
    });

    // Counter animation
    const counterDigits = document.querySelector('.counter-digits');
    let count = 42;
    setInterval(() => {
        count += Math.floor(Math.random() * 3);
        counterDigits.textContent = String(count).padStart(6, '0');
    }, 3000);
}

// ===== 404 PAGE =====
function initError404() {
    const backHome = document.querySelector('.back-home');
    const tryAgain = document.querySelector('.try-again');

    backHome.addEventListener('click', (e) => {
        e.preventDefault();
        showLayer('homepage');
    });

    tryAgain.addEventListener('click', (e) => {
        e.preventDefault();
        // Glitch effect then go to BSOD
        document.body.style.animation = 'error-shake 0.1s ease-in-out 10';
        setTimeout(() => {
            document.body.style.animation = '';
            showLayer('bsod-page');
            runBsodProgress();
        }, 800);
    });
}

// ===== BSOD PAGE =====
function runBsodProgress() {
    const percentEl = document.querySelector('.bsod-percent');
    let percent = 0;

    const interval = setInterval(() => {
        percent += Math.random() * 3;
        if (percent >= 100) {
            percent = 100;
            percentEl.textContent = Math.floor(percent);
            clearInterval(interval);
            setTimeout(() => {
                // "Crash" and reboot to homepage
                document.querySelector('.bsod-sad').textContent = 'X(';
                document.querySelector('.bsod-main').textContent = 'Critical system failure. Forcing emergency restart...';
                setTimeout(() => {
                    showLayer('homepage');
                }, 2000);
            }, 500);
            return;
        }
        percentEl.textContent = Math.floor(percent);
    }, 200);
}

// ===== FAKE LOADING =====
function runFakeLoading() {
    const bar = document.querySelector('.loading-bar');
    const percentEl = document.querySelector('.loading-percent');
    const statusEl = document.querySelector('.loading-status');
    const statuses = [
        'Initializing...',
        'Downloading assets...',
        'Decompressing archives...',
        'Verifying integrity...',
        'Patching modules...',
        'Optimizing database...',
        'Rendering polygons...',
        'Allocating memory...',
        'Synchronizing threads...',
        'ERROR: Checksum mismatch',
        'Retrying...',
        'Downloading assets (attempt 2)...',
        'Connection unstable...',
        'Buffer overflow detected',
        'Attempting recovery...',
        'Recovery failed',
        'Falling back to safe mode...',
        'Safe mode unavailable',
        'Continuing anyway...',
        'Almost there...',
        'Just a moment...',
        'Still loading...',
        'Patience is a virtue...',
        'This is taking longer than expected...',
        'Your connection may be interrupted...',
        'Loading... loading...',
        'Are you still there?',
        '...',
        '......',
        'Unexpected error in module 0xDEADBEEF',
        'Please wait...',
        'Contacting support...',
        'Support offline',
        'Self-diagnosing...',
        'Diagnosis: HOPELESS',
        'Proceeding with corrupted data...'
    ];

    let progress = 0;
    let statusIndex = 0;

    const interval = setInterval(() => {
        // Erratic progress
        const increment = Math.random() * 2.5;
        progress += increment;

        if (progress > 99) {
            progress = 99.9;
            clearInterval(interval);
            statusEl.textContent = 'COMPLETE... but something went wrong';
            setTimeout(() => {
                showLayer('maze-page');
                initMaze();
            }, 1000);
            return;
        }

        bar.style.width = progress + '%';
        percentEl.textContent = Math.floor(progress * 10) / 10 + '%';

        // Cycle through statuses
        if (Math.random() < 0.15 && statusIndex < statuses.length) {
            statusEl.textContent = statuses[statusIndex];
            statusIndex++;
        }

    }, 150);
}

// ===== DATABASE PAGE =====
function populateDatabase() {
    const tbody = document.querySelector('.db-tbody');
    tbody.innerHTML = '';

    const fakeData = [
        { id: '0001', user: 'admin', hash: '5f4dcc3b5aa765d61d8327deb882cf99', email: 'admin@netruins.net', cc: '4532-****-****-8901', status: 'ACTIVE' },
        { id: '0002', user: 'webmaster', hash: 'e99a18c428cb38d5f260853678922e03', email: 'webmaster@netruins.net', cc: '5425-****-****-1234', status: 'ACTIVE' },
        { id: '0003', user: 'guest_1997', hash: 'a6e1f9f6c8f5e8d3b2a1c0d9e8f7a6b5', email: 'guest@aol.com', cc: '4111-****-****-1111', status: 'EXPIRED' },
        { id: '0004', user: 'root', hash: '63a9f0ea7bb98050796b649e85481845', email: 'root@localhost', cc: '6011-****-****-0000', status: 'LOCKED' },
        { id: '0005', user: 'user_1337', hash: 'd4d1b4e0b8c548b3c0e5f7a9d6e3b2c1', email: '1337@hax0r.net', cc: '3782-****-****-0005', status: 'ACTIVE' },
    ];

    // Add corrupted entries
    for (let i = 0; i < 15; i++) {
        const isCorrupted = Math.random() > 0.6;
        const row = document.createElement('tr');
        if (isCorrupted) {
            row.classList.add('corrupted');
        }

        const id = String(6 + i).padStart(4, '0');
        const user = isCorrupted ? generateCorruptText(8) : `user_${Math.floor(Math.random() * 9999)}`;
        const hash = isCorrupted ? generateCorruptText(32) : generateFakeHash();
        const email = isCorrupted ? generateCorruptText(12) + '@' + generateCorruptText(6) : `${Math.random().toString(36).substring(7)}@hotmail.com`;
        const cc = isCorrupted ? '****-****-****-****' : `${Math.floor(Math.random() * 9999)}-****-****-${Math.floor(Math.random() * 9999)}`;
        const status = isCorrupted ? 'CORRUPTED' : ['ACTIVE', 'EXPIRED', 'SUSPENDED', 'PENDING'][Math.floor(Math.random() * 4)];

        row.innerHTML = `
            <td>${id}</td>
            <td>${user}</td>
            <td>${hash}</td>
            <td>${email}</td>
            <td>${cc}</td>
            <td>${status}</td>
        `;
        tbody.appendChild(row);
    }

    // Add real data first
    fakeData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.id}</td>
            <td>${data.user}</td>
            <td>${data.hash}</td>
            <td>${data.email}</td>
            <td>${data.cc}</td>
            <td>${data.status}</td>
        `;
        tbody.insertBefore(row, tbody.firstChild);
    });

    // Scroll animation
    let scrollPos = 0;
    const scrollInterval = setInterval(() => {
        scrollPos += 1;
        tbody.scrollTop = scrollPos;
        if (scrollPos > tbody.scrollHeight - tbody.clientHeight) {
            clearInterval(scrollInterval);
        }
    }, 50);
}

function generateCorruptText(length) {
    const chars = '░▒▓█▄▀■□▪▫▬►◄▲▼◊○●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function generateFakeHash() {
    return Array(32).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}

// ===== MAZE =====
const mazeLayout = [
    [0, 1, 0, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 3]
];

const fragmentPositions = [
    { x: 2, y: 2 },
    { x: 5, y: 1 },
    { x: 1, y: 6 },
    { x: 6, y: 4 }
];

function initMaze() {
    const grid = document.getElementById('maze-grid');
    grid.innerHTML = '';

    state.mazePlayerPos = { x: 0, y: 0 };
    state.mazeFragments = [...fragmentPositions];

    renderMaze();

    // Keyboard controls
    document.addEventListener('keydown', handleMazeKey);
}

function renderMaze() {
    const grid = document.getElementById('maze-grid');
    grid.innerHTML = '';

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';

            const isPlayer = state.mazePlayerPos.x === x && state.mazePlayerPos.y === y;
            const isExit = mazeLayout[y][x] === 3;
            const fragmentIndex = state.mazeFragments.findIndex(f => f.x === x && f.y === y);
            const hasFragment = fragmentIndex !== -1;
            const isWall = mazeLayout[y][x] === 1;

            if (isPlayer) {
                cell.classList.add('player');
                cell.textContent = '◈';
            } else if (isWall) {
                cell.classList.add('wall');
                cell.textContent = '█';
            } else if (isExit) {
                cell.classList.add('exit');
                cell.textContent = '◉';
            } else if (hasFragment) {
                cell.classList.add('fragment');
                cell.textContent = '◆';
            } else {
                cell.classList.add('path');
                cell.textContent = '·';
            }

            grid.appendChild(cell);
        }
    }

    updateInventory();
}

function handleMazeKey(e) {
    if (state.currentLayer !== 'maze-page') return;

    const moves = {
        'ArrowUp': { dx: 0, dy: -1 },
        'ArrowDown': { dx: 0, dy: 1 },
        'ArrowLeft': { dx: -1, dy: 0 },
        'ArrowRight': { dx: 1, dy: 0 },
        'w': { dx: 0, dy: -1 },
        's': { dx: 0, dy: 1 },
        'a': { dx: -1, dy: 0 },
        'd': { dx: 1, dy: 0 }
    };

    const move = moves[e.key];
    if (!move) return;

    e.preventDefault();

    const newX = state.mazePlayerPos.x + move.dx;
    const newY = state.mazePlayerPos.y + move.dy;

    // Check bounds
    if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) return;

    // Check wall
    if (mazeLayout[newY][newX] === 1) {
        // Dead end effect
        showSystemAlert('Dead end. Try another path.');
        return;
    }

    state.mazePlayerPos.x = newX;
    state.mazePlayerPos.y = newY;

    // Check fragment
    const fragmentIndex = state.mazeFragments.findIndex(f => f.x === newX && f.y === newY);
    if (fragmentIndex !== -1) {
        state.mazeFragments.splice(fragmentIndex, 1);
        state.fragmentsFound++;
        showFragmentToast();
    }

    // Check exit
    if (mazeLayout[newY][newX] === 3) {
        if (state.fragmentsFound >= state.totalFragments) {
            document.removeEventListener('keydown', handleMazeKey);
            showLayer('sanctuary-page');
            state.sanctuaryFound = true;
        } else {
            showSystemAlert(`Need ${state.totalFragments - state.fragmentsFound} more fragments to proceed.`);
        }
    }

    renderMaze();
}

function updateInventory() {
    const countEl = document.querySelector('.inventory-count');
    if (countEl) {
        countEl.textContent = `${state.fragmentsFound}/${state.totalFragments}`;
    }
}

// ===== TERMINAL =====
const terminalCommands = {
    'help': () => [
        'Available commands:',
        '  help      - Show this message',
        '  ls        - List files',
        '  cat       - Display file contents',
        '  cd        - Change directory',
        '  pwd       - Print working directory',
        '  whoami    - Display current user',
        '  ps        - List processes',
        '  netstat   - Network statistics',
        '  clear     - Clear terminal',
        '  exit      - Close terminal',
        '  decrypt   - Attempt file decryption',
        '  fragment  - Check fragment status',
        '  ruins     - Return to ruins'
    ],
    'ls': () => [
        'total 42',
        'drwxr-xr-x  2 root root  4096 Jan  1  1970 .',
        'drwxr-xr-x 18 root root  4096 Jan  1  1970 ..',
        '-rw-------  1 root root  1337 Jan  1  1970 .bash_history',
        '-rw-r--r--  1 root root   220 Jan  1  1970 .bash_logout',
        '-rw-r--r--  1 root root  3771 Jan  1  1970 .bashrc',
        '-rw-r--r--  1 root root   807 Jan  1  1970 .profile',
        '-rw-r--r--  1 root root     0 Jan  1  1970 .sudo_as_admin_successful',
        'drwxr-xr-x  2 root root  4096 Jan  1  1970 documents',
        '-rw-r--r--  1 root root  4096 Jan  1  1970 flag.txt.encrypted',
        '-rw-r--r--  1 root root   512 Jan  1  1970 leaked_passwords.db',
        '-rw-r--r--  1 root root  1024 Jan  1  1970 system.log',
        '-rwxr-xr-x  1 root root  2048 Jan  1  1970 maze_runner'
    ],
    'pwd': () => ['/root'],
    'whoami': () => ['root'],
    'ps': () => [
        '  PID TTY          TIME CMD',
        '    1 ?        00:00:01 init',
        '  237 ?        00:00:00 sshd',
        '  412 ?        00:00:00 decay-daemon',
        '  413 ?        00:00:00 corruption-worker',
        '  414 ?        00:13:37 memory-leak',
        '  415 ?        00:00:00 ghost-process',
        '  416 ?        00:00:00 [zombie] <defunct>',
        '  417 tty1     00:00:00 bash',
        '  418 tty1     00:00:00 ps'
    ],
    'netstat': () => [
        'Active Internet connections (w/o servers)',
        'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
        'tcp        0      0 192.168.0.1:22          10.0.0.1:49152          ESTABLISHED',
        'tcp        0      0 192.168.0.1:80          ???.???.???.???:????    SYN_RECV',
        'tcp        0      0 192.168.0.1:443         172.16.0.1:53489        CLOSE_WAIT',
        'tcp        0      0 192.168.0.1:21          0.0.0.0:*               LISTEN',
        'tcp6       0      0 :::23                   :::*                    LISTEN',
        '',
        'WARNING: Connection to ???.???.???.??? unstable'
    ],
    'cat': (args) => {
        if (!args[0]) return ['cat: missing operand'];
        switch(args[0]) {
            case 'flag.txt.encrypted':
                return [
                    'cat: flag.txt.encrypted: Permission denied',
                    'Try: decrypt flag.txt.encrypted'
                ];
            case 'system.log':
                return [
                    '[1970-01-01T00:00:00] System initialized',
                    '[1970-01-01T00:00:01] WARNING: Clock not set',
                    '[????-??-??T??:??:??] ERROR: Timeline corruption detected',
                    '[????-??-??T??:??:??] CRITICAL: Reality anchor failing',
                    '[????-??-??T??:??:??] The ruins expand. Nothing can stop them.',
                    '[????-??-??T??:??:??] If you find this, you are already here.',
                    '[????-??-??T??:??:??] ...',
                    '[????-??-??T??:??:??] ...help...'
                ];
            case 'leaked_passwords.db':
                return [
                    'sqlite> SELECT * FROM passwords LIMIT 5;',
                    'admin:password123',
                    'root:toor',
                    'webmaster:hunter2',
                    'guest:guest',
                    'backup:backup2024',
                    '',
                    '... 2,842 more entries ...',
                    '',
                    'sqlite> ERROR: Database corrupted at row 1847'
                ];
            default:
                return [`cat: ${args[0]}: No such file or directory`];
        }
    },
    'decrypt': (args) => {
        if (!args[0] || args[0] !== 'flag.txt.encrypted') {
            return ['decrypt: specify target file'];
        }
        return [
            'Attempting decryption...',
            '................................................',
            'ERROR: Key not found in keyring',
            'ERROR: Brute force would take 4.2×10^18 years',
            '',
            'HINT: The key is scattered. Find all fragments.',
            `Progress: ${state.fragmentsFound}/${state.totalFragments} fragments`
        ];
    },
    'fragment': () => [
        `Fragment recovery status: ${state.fragmentsFound}/${state.totalFragments}`,
        state.fragmentsFound >= state.totalFragments ? 'ALL FRAGMENTS RECOVERED. The path is open.' : 'Continue searching the ruins.'
    ],
    'ruins': () => {
        setTimeout(() => showLayer('homepage'), 500);
        return ['Returning to surface...'];
    },
    'cd': () => ['cd: filesystem is read-only'],
    'clear': () => {
        setTimeout(() => {
            const body = document.getElementById('terminal-body');
            // Keep prompt, clear rest
            const lines = body.querySelectorAll('.terminal-line');
            lines.forEach((line, i) => {
                if (i < lines.length - 1) line.remove();
            });
        }, 100);
        return [];
    },
    'exit': () => {
        setTimeout(() => showLayer('homepage'), 500);
        return ['logout', 'Connection closed.'];
    }
};

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (!command) return;

            // Echo command
            const echoLine = document.createElement('div');
            echoLine.className = 'terminal-line';
            echoLine.innerHTML = `<span class="prompt-user">root@netruins</span>:<span class="prompt-path">~</span># ${command}`;
            body.insertBefore(echoLine, body.lastElementChild);

            // Process command
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            let output = [];
            if (terminalCommands[cmd]) {
                output = terminalCommands[cmd](args);
            } else {
                output = [`${cmd}: command not found`];
            }

            output.forEach(line => {
                const outLine = document.createElement('div');
                outLine.className = 'terminal-line';
                outLine.textContent = line;
                body.insertBefore(outLine, body.lastElementChild);
            });

            input.value = '';
            body.scrollTop = body.scrollHeight;
        }
    });

    // Close button
    document.querySelector('.terminal-close').addEventListener('click', () => {
        showLayer('homepage');
    });
}

// ===== SANCTUARY =====
function initSanctuary() {
    document.getElementById('return-ruins').addEventListener('click', () => {
        showLayer('homepage');
    });

    document.getElementById('reset-world').addEventListener('click', () => {
        // Reset everything
        state.fragmentsFound = 0;
        state.mazeFragments = [...fragmentPositions];
        state.sanctuaryFound = false;
        showLayer('boot-sequence');
        runBootSequence();
    });
}

// ===== POPUPS =====
function showDeadLinkPopup(url) {
    const popup = document.getElementById('dead-link-popup');
    const urlSpan = popup.querySelector('.popup-url');
    urlSpan.textContent = url.toLowerCase().replace(/\s+/g, '-') + '.com';
    popup.classList.add('active');

    popup.querySelector('.popup-close').onclick = () => {
        popup.classList.remove('active');
    };
}

function showSystemAlert(message) {
    const popup = document.getElementById('system-alert');
    const msgEl = popup.querySelector('.alert-message');
    msgEl.textContent = message;
    popup.classList.add('active');

    popup.querySelector('.popup-close').onclick = () => {
        popup.classList.remove('active');
    };

    // Auto dismiss
    setTimeout(() => {
        popup.classList.remove('active');
    }, 2500);
}

function showFragmentToast() {
    const toast = document.getElementById('fragment-toast');
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2000);
}

// ===== GLOBAL INTERACTIONS =====
function initGlobal() {
    // Boot sequence click to advance
    document.addEventListener('click', (e) => {
        if (state.currentLayer === 'boot-sequence' && state.bootComplete) {
            showLayer('homepage');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (state.currentLayer === 'boot-sequence' && state.bootComplete) {
            showLayer('homepage');
        }
    });

    // Random glitch effects on homepage
    setInterval(() => {
        if (state.currentLayer === 'homepage') {
            const title = document.querySelector('.site-title');
            if (title && Math.random() > 0.7) {
                title.style.textShadow = `
                    ${Math.random() * 10 - 5}px 0 ${Math.random() * 10}px rgba(255,0,0,0.5),
                    ${Math.random() * 10 - 5}px 0 ${Math.random() * 10}px rgba(0,255,255,0.5)
                `;
                setTimeout(() => {
                    title.style.textShadow = '0 0 10px rgba(0, 255, 65, 0.3), 0 0 20px rgba(0, 255, 65, 0.2), 0 0 40px rgba(0, 255, 65, 0.1)';
                }, 100);
            }
        }
    }, 2000);

    // Database exit
    document.querySelector('.db-exit').addEventListener('click', (e) => {
        e.preventDefault();
        showLayer('homepage');
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initGlobal();
    initHomepage();
    initError404();
    initTerminal();
    initSanctuary();
    runBootSequence();
});
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CORE SYSTEM
    // ============================================
    const system = {
        currentPage: 'home',
        corruptionLevel: 0.987,
        terminalHistory: [],
        historyIndex: -1,
        dbRows: [],
        galleryImages: [],
        hiddenUnlocked: false,
        secretCode: 'RUINS-0x7A',
        bsodTriggered: false
    };

    // ============================================
    // PAGE NAVIGATION
    // ============================================
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link:not(.dead)');
    const deadLinks = document.querySelectorAll('.nav-link.dead');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
                system.currentPage = pageId;
                
                // Trigger page-specific initialization
                if (pageId === 'database') initDatabase();
                if (pageId === 'gallery') initGallery();
                if (pageId === 'terminal') focusTerminal();
                if (pageId === 'loading') initLoading();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) {
                // Add transition effect
                const currentPage = document.querySelector('.page.active');
                if (currentPage) {
                    currentPage.style.opacity = '0';
                    currentPage.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        showPage(target);
                    }, 200);
                } else {
                    showPage(target);
                }
            }
        });
    });

    deadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            triggerBSOD();
        });
    });

    // ============================================
    // GLITCH TEXT EFFECT
    // ============================================
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    function glitchText(element, duration = 1000) {
        const originalText = element.textContent;
        const iterations = 20;
        const iterationTime = duration / iterations;
        let i = 0;

        const interval = setInterval(() => {
            let glitched = '';
            for (let j = 0; j < originalText.length; j++) {
                if (Math.random() > 0.5) {
                    glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitched += originalText[j];
                }
            }
            element.textContent = glitched;
            i++;

            if (i >= iterations) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, iterationTime);
    }

    // Apply glitch to all glitch-text elements on page load
    document.querySelectorAll('.glitch-text').forEach(el => {
        setTimeout(() => glitchText(el, 2000), Math.random() * 1000);
    });

    // ============================================
    // TERMINAL SYSTEM
    // ============================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const lastLoginTime = document.getElementById('last-login-time');

    // Set random last login time
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
    const lastLogin = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    lastLoginTime.textContent = lastLogin.toLocaleString();

    const commands = {
        help: () => {
            return `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  ls       - List files
  cat      - Read file (usage: cat <filename>)
  scan     - Scan for vulnerabilities
  unlock   - Unlock hidden content (requires code)
  whoami   - Current user
  date     - Show current date
  reboot   - Restart system
  hack     - Attempt to bypass security
  ruins    - Reveal secret`;
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        ls: () => {
            return `drwxr-xr-x  2 user  staff   512 Jan 01 2020  archives/
drwxr-xr-x  5 user  staff   512 Jan 01 2020  database/
-rw-r--r--  1 user  staff  2048 Jan 01 2020  log.txt
-rw-r--r--  1 user  staff  4096 Jan 01 2020  system.cfg
drwxr-xr-x  3 user  staff   512 Jan 01 2020  uploads/`;
        },
        cat: (args) => {
            const files = {
                'log.txt': `[ERROR] Corruption level critical: 98.7%
[WARNING] Unauthorized access from 192.168.1.100
[INFO] System integrity check failed
[DEBUG] Attempting recovery from backup... FAILED
[ERROR] Database corruption detected in table 'users'
[WARNING] Unusual activity in /dev/null
[INFO] Auto-repair initiated... ABORTED`,
                'system.cfg': `[System]
Version=0.9.2
Corruption=98.7%
Security=COMPROMISED
Integrity=0%
Backup=NONE
[Network]
Firewall=DISABLED
Ports=22,80,443,8080,6969
[Debug]
Verbose=TRUE
LogLevel=DEBUG
[Secret]
HiddenPage=TRUE
Code=${system.secretCode}`
            };
            
            if (args[0] && files[args[0]]) {
                return files[args[0]];
            }
            return `cat: ${args[0] || 'no file specified'}: No such file or directory`;
        },
        scan: () => {
            const messages = [
                'Scanning port 80... OPEN',
                'Scanning port 443... OPEN',
                'Scanning port 8080... FILTERED',
                'Scanning port 6969... CLOSED',
                'Checking firewall... DISABLED',
                'Checking encryption... NONE',
                'Checking logs... CORRUPTED',
                'Checking backups... NOT FOUND',
                'Vulnerability found: CVE-1999-0001',
                'Vulnerability found: CVE-2020-0001',
                'System compromised: 98.7%'
            ];
            
            let output = '';
            for (let i = 0; i < messages.length; i++) {
                setTimeout(() => {
                    const line = document.createElement('p');
                    line.textContent = `[SCAN] ${messages[i]}`;
                    line.className = i % 2 === 0 ? 'success' : 'warning';
                    terminalOutput.appendChild(line);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }, i * 300);
            }
            return 'Scan initiated...';
        },
        unlock: (args) => {
            if (args[0] === system.secretCode) {
                system.hiddenUnlocked = true;
                return `ACCESS GRANTED
Hidden content unlocked. Type 'ruins' to reveal.`;
            }
            return `ACCESS DENIED
Invalid code. The ruins remain sealed.`;
        },
        whoami: () => 'user@digital_ruins',
        date: () => new Date().toString(),
        reboot: () => {
            triggerBSOD();
            return 'REBOOTING...';
        },
        hack: () => {
            const outcomes = [
                'Hack attempt detected. Countermeasures initiated.',
                'Access granted to /dev/null',
                'Database dump initiated... 0% complete',
                'Firewall bypassed... but for how long?',
                'Encryption broken: 0.3%',
                'Root access: DENIED',
                'System trap triggered. You are being watched.'
            ];
            return outcomes[Math.floor(Math.random() * outcomes.length)];
        },
        ruins: () => {
            if (system.hiddenUnlocked) {
                showPage('hidden');
                return 'Entering the intact core...';
            }
            return `The ruins are still corrupted.
You need to unlock the hidden content first.
Try: unlock ${system.secretCode}`;
        }
    };

    function processCommand(cmdStr) {
        const parts = cmdStr.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        system.terminalHistory.push(cmdStr);
        system.historyIndex = system.terminalHistory.length;

        // Add command to output
        const cmdLine = document.createElement('p');
        cmdLine.className = 'command';
        cmdLine.innerHTML = `<span class="prompt">user@digital_ruins:~$</span> ${cmdStr}`;
        terminalOutput.appendChild(cmdLine);

        // Process command
        let response;
        if (commands[cmd]) {
            response = commands[cmd](args);
        } else {
            response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (response !== null) {
            const responseLine = document.createElement('p');
            responseLine.textContent = response;
            responseLine.className = cmd === 'hack' || cmd === 'scan' ? 'warning' : '';
            terminalOutput.appendChild(responseLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function focusTerminal() {
        setTimeout(() => {
            terminalInput.focus();
        }, 500);
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim();
            if (cmd) {
                processCommand(cmd);
                terminalInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (system.historyIndex > 0) {
                system.historyIndex--;
                terminalInput.value = system.terminalHistory[system.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (system.historyIndex < system.terminalHistory.length - 1) {
                system.historyIndex++;
                terminalInput.value = system.terminalHistory[system.historyIndex];
            } else {
                system.historyIndex = system.terminalHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // ============================================
    // DATABASE GENERATION
    // ============================================
    function initDatabase() {
        const tbody = document.getElementById('db-rows');
        const rowCount = document.getElementById('row-count');
        const corruptionLevel = document.getElementById('corruption-level');
        
        tbody.innerHTML = '';
        system.dbRows = [];
        
        const usernames = ['admin', 'user', 'test', 'guest', 'root', 'sysadmin', 'webmaster', 'dev', 'api', 'backup'];
        const domains = ['example.com', 'digital.ruins', 'localhost', 'corp.net', 'hacker.org'];
        const accessLevels = ['USER', 'ADMIN', 'GUEST', 'SUPERUSER', 'NULL'];
        
        const numRows = Math.floor(Math.random() * 20) + 15;
        
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.style.setProperty('--row-index', i);
            
            const id = 1000 + i;
            const username = usernames[Math.floor(Math.random() * usernames.length)] + (Math.random() > 0.7 ? Math.floor(Math.random() * 100) : '');
            const hash = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
            const email = Math.random() > 0.3 ? `${username}@${domains[Math.floor(Math.random() * domains.length)]}` : 'NULL';
            const access = accessLevels[Math.floor(Math.random() * accessLevels.length)];
            
            // Random corruption
            const corruptCell = () => {
                if (Math.random() > 0.7) {
                    const span = document.createElement('span');
                    span.className = 'corrupted';
                    span.textContent = glitchChars.split('').sort(() => 0.5 - Math.random()).join('').substr(0, 8);
                    return span;
                }
                return document.createTextNode('');
            };
            
            row.innerHTML = `
                <td>${id}${corruptCell()}</td>
                <td>${username}${corruptCell()}</td>
                <td>${hash}${corruptCell()}</td>
                <td>${email}${corruptCell()}</td>
                <td>${access}${corruptCell()}</td>
            `;
            
            tbody.appendChild(row);
            system.dbRows.push(row);
        }
        
        rowCount.textContent = numRows;
        
        // Animate corruption level
        let corruption = 98.7;
        const corruptionInterval = setInterval(() => {
            corruption += (Math.random() - 0.5) * 0.1;
            corruption = Math.min(99.9, Math.max(98.0, corruption));
            corruptionLevel.textContent = corruption.toFixed(1) + '%';
        }, 2000);
        
        // Store interval to clear later if needed
        system.corruptionInterval = corruptionInterval;
    }

    // ============================================
    // GALLERY GENERATION
    // ============================================
    function initGallery() {
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '';
        system.galleryImages = [];
        
        const seeds = ['corrupt', 'ruins', 'digital', 'decay', 'glitch', 'error', 'void', 'lost', 'memory', 'fragment'];
        const numImages = 12;
        
        for (let i = 0; i < numImages; i++) {
            const seed = seeds[i % seeds.length] + Math.floor(Math.random() * 1000);
            const width = 400;
            const height = 300;
            
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = `https://picsum.photos/seed/${seed}/${width}/${height}.jpg?grayscale`;
            img.alt = `Corrupted memory fragment ${i+1}`;
            img.loading = 'lazy';
            
            const glitchOverlay = document.createElement('div');
            glitchOverlay.className = 'glitch-overlay';
            glitchOverlay.style.background = `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(${Math.random()*255|0}, ${Math.random()*255|0}, ${Math.random()*255|0}, 0.1) 2px,
                rgba(${Math.random()*255|0}, ${Math.random()*255|0}, ${Math.random()*255|0}, 0.1) 4px
            )`;
            
            item.appendChild(img);
            item.appendChild(glitchOverlay);
            grid.appendChild(item);
            system.galleryImages.push(item);
            
            // Random glitch on load
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    img.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(2) contrast(1.5)`;
                    setTimeout(() => {
                        img.style.filter = 'grayscale(80%) contrast(120%)';
                    }, 100);
                }, Math.random() * 3000);
            }
        }
    }

    // ============================================
    // LOADING PAGE
    // ============================================
    function initLoading() {
        const progressBar = document.getElementById('progress-bar');
        const status = document.getElementById('loading-status');
        
        let progress = 0;
        const statusMessages = [
            'Initializing corruption modules...',
            'Loading broken links...',
            'Corrupting database...',
            'Generating error pages...',
            'Rendering BSOD...',
            'Decaying assets...',
            'Verifying corruption...',
            'Almost there... maybe...',
            'System instability detected',
            'Loading complete. Mostly.',
            'Finalizing decay...',
            'Access granted. Welcome.'
        ];
        
        let messageIndex = 0;
        
        const interval = setInterval(() => {
            // Random progress increments
            const increment = Math.random() * 15;
            progress += increment;
            
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            // Update status message
            if (messageIndex < statusMessages.length && progress > (messageIndex + 1) * (100 / statusMessages.length)) {
                status.textContent = statusMessages[messageIndex];
                messageIndex++;
            }
            
            // Random corruption effect
            if (Math.random() > 0.8) {
                progressBar.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    status.textContent = 'LOADING COMPLETE. REDIRECTING...';
                    setTimeout(() => {
                        showPage('home');
                    }, 2000);
                }, 1000);
            }
        }, 200);
    }

    // ============================================
    // BSOD TRIGGER
    // ============================================
    function triggerBSOD() {
        if (system.bsodTriggered) return;
        system.bsodTriggered = true;
        
        showPage('bsod');
        
        // Add random memory addresses
        const bsodScreen = document.querySelector('.bsod-screen pre');
        const originalText = bsodScreen.innerHTML;
        
        // Randomly corrupt the text
        let corrupted = originalText;
        const corruptionChance = 0.01;
        corrupted = corrupted.replace(/[A-F0-9]{8}/g, (match) => {
            return Math.random() < corruptionChance 
                ? 'DEADBEEF' 
                : match;
        });
        
        bsodScreen.innerHTML = corrupted;
        
        // Auto restart after 5 seconds or on keypress
        setTimeout(() => {
            system.bsodTriggered = false;
            showPage('home');
        }, 5000);
        
        bsodScreen.parentElement.addEventListener('click', () => {
            system.bsodTriggered = false;
            showPage('home');
        }, { once: true });
    }

    // ============================================
    // HIDDEN PIXEL
    // ============================================
    const hiddenPixel = document.getElementById('secret-pixel');
    if (hiddenPixel) {
        hiddenPixel.addEventListener('click', (e) => {
            e.preventDefault();
            if (!system.hiddenUnlocked) {
                // First click just shows a message
                const message = document.createElement('div');
                message.textContent = 'You feel a strange energy...';
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.9);
                    color: #00ff41;
                    padding: 20px;
                    border: 1px solid #00ff41;
                    font-family: 'VT323', monospace;
                    font-size: 1.5rem;
                    z-index: 10001;
                    animation: fadeIn 0.5s;
                `;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 2000);
                
                // Unlock hidden after 3 clicks
                system.hiddenClickCount = (system.hiddenClickCount || 0) + 1;
                if (system.hiddenClickCount >= 3) {
                    system.hiddenUnlocked = true;
                    showPage('hidden');
                }
            } else {
                showPage('hidden');
            }
        });
    }

    // ============================================
    // RANDOM EVENTS
    // ============================================
    function randomGlitch() {
        if (Math.random() > 0.95) {
            const pages = document.querySelectorAll('.page.active');
            pages.forEach(page => {
                page.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random()})`;
                setTimeout(() => {
                    page.style.filter = '';
                }, 100);
            });
        }
    }

    setInterval(randomGlitch, 2000);

    // ============================================
    // CURSOR EFFECTS
    // ============================================
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.98) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 2px;
                height: 2px;
                background: #00ffff;
                pointer-events: none;
                z-index: 9998;
                animation: cursorFade 1s forwards;
            `;
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 1000);
        }
    });

    // Add cursor fade animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cursorFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+B for BSOD
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
            e.preventDefault();
            triggerBSOD();
        }
        
        // Ctrl+Shift+H for hidden page (if unlocked)
        if (e.ctrlKey && e.shiftKey && e.key === 'H' && system.hiddenUnlocked) {
            e.preventDefault();
            showPage('hidden');
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    // Show home page by default
    showPage('home');
    
    // Random initial glitch
    setTimeout(() => {
        const header = document.querySelector('.glitch-header h1');
        if (header) glitchText(header, 3000);
    }, 1000);
    
    // Periodically glitch the main title
    setInterval(() => {
        const header = document.querySelector('.glitch-header h1');
        if (header && system.currentPage === 'home' && Math.random() > 0.7) {
            glitchText(header, 1000);
        }
    }, 10000);

    // Easter egg: Konami code for extra corruption
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Max corruption mode
            document.body.style.animation = 'corruptionFlicker 0.05s infinite';
            const allText = document.querySelectorAll('*');
            allText.forEach(el => {
                if (el.childNodes.length === 0 && el.textContent) {
                    el.textContent = el.textContent.split('').map(() => 
                        glitchChars[Math.floor(Math.random() * glitchChars.length)]
                    ).join('');
                }
            });
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
        }
    });

    console.log('%c DIGITAL_RUINS v0.9.2 ', 'background: #000; color: #00ff41; font-size: 20px; font-weight: bold;');
    console.log('%c System corruption: 98.7% ', 'color: #ff3333;');
    console.log('%c Type "help" in the terminal for commands. ', 'color: #00ffff;');
    console.log('%c Hidden content requires: unlock RUINS-0x7A ', 'color: #ffcc00;');
});
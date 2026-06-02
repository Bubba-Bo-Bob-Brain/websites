/** =====================================================
CYBER//BREACH - Cyberpunk Hacking Terminal
Interactive JavaScript
===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initMatrixRain();
    initNavigation();
    initTerminal();
    initNetworkMap();
    initExploits();
    initLogs();
    initFiles();
    initModal();
    initToast();
    initUptime();
    initTypingEffect();
    initRandomLogs();
});

// =====================================================
// MATRIX RAIN EFFECT
// =====================================================

function initMatrixRain() {
    var canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/\\`~';
    var charArray = chars.split('');
    var fontSize = 14;
    var columns = Math.floor(width / fontSize);
    var drops = [];
    
    for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#39ff14';
        ctx.font = fontSize + 'px monospace';
        
        for (var i = 0; i < drops.length; i++) {
            var char = charArray[Math.floor(Math.random() * charArray.length)];
            var x = i * fontSize;
            var y = drops[i] * fontSize;
            ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            ctx.fillText(char, x, y);
            
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', function() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}

// =====================================================
// NAVIGATION
// =====================================================

function initNavigation() {
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('data-section');
            
            navLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            link.classList.add('active');
            
            sections.forEach(function(section) {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// =====================================================
// TERMINAL
// =====================================================

function initTerminal() {
    var terminalInput = document.getElementById('terminal-input');
    var terminalOutput = document.getElementById('command-history');
    var terminalBody = document.getElementById('terminal-body');
    
    if (!terminalInput) return;
    
    var commandHistory = [];
    var historyIndex = -1;
    
    var commands = {
        help: function() {
            return 'Available commands:\nhelp - Show this help message\nclear - Clear terminal history\nls - List available modules\nscan - Run network scan\nwhoami - Display current user\nexit - Exit session\nstatus - Show system status\nexploits - List available exploits\ndecrypt - Decrypt files';
        },
        
        clear: function() {
            terminalOutput.innerHTML = '';
            return null;
        },
        
        ls: function() {
            return 'MODULES/\nexploits/\nscripts/\nlogs/\nloot/\ndownloads/\nkeyfiles/\ncredentials.txt\nhashlist.txt\nnetwork_map.png';
        },
        
        scan: function() {
            return 'Scanning network...\n[████████████████████] 100%\nFound 9 active hosts\n1 vulnerable target detected\n1 compromised node identified\nScan complete.';
        },
        
        whoami: function() {
            return 'root@cyberbreach\nUID:0 GID:0\nGroups:root, wheel, sudo\nAccess Level: MAXIMUM';
        },
        
        exit: function() {
            return 'Session terminated. Goodbye, hacker.';
        },
        
        status: function() {
            return 'System Status: ONLINE\nConnection: SECURE (VPN Tunnel)\nEncryption: AES-256\nGateway: 192.168.0.1\nLatency: 12ms\nPacket Loss: 0%';
        },
        
        exploits: function() {
            return 'Available Exploits:\n[1] SQL Injection Pro (CVSS: 9.8)\n[2] Buffer Overflow Kit (CVSS: 8.5)\n[3] Zero-Day Chain (CVSS: 10.0)\n[4] Dictionary Attack (CVSS: 5.3)\n[5] Phishing Generator (CVSS: 6.1)\n[6] Encryption Payload (CVSS: 9.1)\nType deploy <number> to launch';
        },
        
        decrypt: function() {
            return 'Decryption module loaded.\nEnter target file: ';
        },
        
        date: function() {
            return new Date().toString();
        },
        
        pwd: function() {
            return '/root/operations';
        },
        
        uname: function() {
            return 'Linux cyberbreach 5.15.0-47-generic #47-Ubuntu SMP x86_64 GNU/Linux';
        },
        
        id: function() {
            return 'uid=0(root) gid=0(root) groups=0(root)';
        },
        
        echo: function(args) {
            return args.join(' ') || '';
        },
        
        cat: function(args) {
            if (!args[0]) return 'Usage: cat <file>';
            return 'Reading ' + args[0] + '...\n[File contents would appear here]';
        },
        
        cd: function(args) {
            if (!args[0] || args[0] === '~') return '/root';
            if (args[0] === '..') return '/';
            return '/root/' + args[0];
        },
        
        sudo: function() {
            return 'You are root. Access granted.';
        },
        
        wget: function() {
            return 'Downloading...\n100% complete';
        },
        
        curl: function() {
            return 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"success"}';
        },
        
        nmap: function() {
            return 'Starting Nmap scan...\nPORT STATE SERVICE\n22/tcp open ssh\n80/tcp open http\n443/tcp open https\n3306/tcp open mysql\nNmap done: 1 IP address scanned';
        },
        
        netstat: function() {
            return 'Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address Foreign Address State\ntcp 0 0 0.0.0.0:22 0.0.0.0:* LISTEN\ntcp 0 0 0.0.0.0:80 0.0.0.0:* LISTEN\ntcp 0 0 192.168.0.1337:443 185.234.72.19:443 ESTABLISHED';
        },
        
        ps: function() {
            return '  PID TTY TIME CMD\n    1 ? 00:00:05 systemd\n  234 ? 00:00:02 sshd\n  567 ? 00:00:15 python3\n  891 ? 00:01:23 node\n 1024 ? 00:00:08 bash';
        }
    };
    
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var command = terminalInput.value.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                executeCommand(command);
            }
            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });
    
    function executeCommand(cmd) {
        var parts = cmd.split(' ');
        var command = parts[0].toLowerCase();
        var args = parts.slice(1);
        var output = '';
        
        if (commands[command]) {
            output = commands[command](args);
        } else if (command.indexOf('deploy') === 0) {
            var exploitNum = parseInt(args[0]);
            if (exploitNum >= 1 && exploitNum <= 6) {
                output = 'Deploying exploit ' + exploitNum + '...\n[████████████████████] 100%\nExploit deployed successfully!';
                showToast('Exploit ' + exploitNum + ' deployed!', 'success');
            } else {
                output = 'Error: Invalid exploit number. Use exploits to see available options.';
            }
        } else {
            output = 'Command not found: ' + command + '\nType help for available commands.';
        }
        
        if (output) {
            var outputDiv = document.createElement('div');
            outputDiv.className = 'command-output';
            outputDiv.innerHTML = '<span class="prompt">root@cyberbreach:~$</span> ' + escapeHtml(cmd) + '<br><br>' + output.replace(/\n/g, '<br>');
            terminalOutput.appendChild(outputDiv);
        }
    }
    
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    terminalBody.addEventListener('click', function() {
        terminalInput.focus();
    });
}

// =====================================================
// NETWORK MAP
// =====================================================

function initNetworkMap() {
    var nodes = document.querySelectorAll('.node');
    
    nodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            var ip = node.getAttribute('data-ip');
            showToast('Selected: ' + ip, 'info');
        });
        
        node.addEventListener('click', function() {
            var ip = node.getAttribute('data-ip');
            var type = 'secure';
            if (node.classList.contains('vulnerable')) {
                type = 'vulnerable';
            } else if (node.classList.contains('compromised')) {
                type = 'compromised';
            }
            
            showToast('Connecting to ' + ip + '...', 'info');
            
            setTimeout(function() {
                var toastType = type === 'secure' ? 'success' : 'warning';
                showToast('Connection established to ' + ip + ' [' + type.toUpperCase() + ']', toastType);
            }, 1000);
        });
    });
    
    var connections = document.querySelectorAll('.connection-line');
    connections.forEach(function(conn) {
        conn.style.strokeDashoffset = Math.random() * 100;
    });
}

// =====================================================
// EXPLOITS
// =====================================================

function initExploits() {
    var exploitCards = document.querySelectorAll('.exploit-card');
    var modal = document.getElementById('exploit-modal');
    var modalExploitName = document.getElementById('modal-exploit-name');
    var modalClose = document.querySelector('.modal-close');
    var modalCancel = document.querySelector('.modal-btn.cancel');
    var modalConfirm = document.querySelector('.modal-btn.confirm');
    var currentExploit = null;
    
    exploitCards.forEach(function(card) {
        var deployBtn = card.querySelector('.exploit-btn');
        deployBtn.addEventListener('click', function() {
            var exploitName = card.querySelector('.exploit-name').textContent;
            var exploitId = card.querySelector('.exploit-id').textContent;
            currentExploit = { name: exploitName, id: exploitId };
            modalExploitName.textContent = exploitName;
            document.getElementById('modal-timestamp').textContent = new Date().toISOString();
            openModal();
        });
    });
    
    function openModal() {
        modal.classList.add('active');
    }
    
    function closeModal() {
        modal.classList.remove('active');
        currentExploit = null;
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    if (modalConfirm) {
        modalConfirm.addEventListener('click', function() {
            if (currentExploit) {
                showToast('Deploying ' + currentExploit.name + '...', 'warning');
                closeModal();
                
                setTimeout(function() {
                    showToast(currentExploit.name + ' deployed successfully!', 'success');
                    addLogEntry('success', currentExploit.name + ' deployed on target 10.0.0.88');
                }, 1500);
            }
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// =====================================================
// LOGS
// =====================================================

function initLogs() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var searchInput = document.querySelector('.search-input');
    var logsList = document.getElementById('logs-list');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            filterLogs(filter);
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var searchTerm = e.target.value.toLowerCase();
            var logEntries = logsList.querySelectorAll('.log-entry');
            
            logEntries.forEach(function(entry) {
                var message = entry.querySelector('.log-message').textContent.toLowerCase();
                if (message.indexOf(searchTerm) !== -1) {
                    entry.style.display = 'flex';
                } else {
                    entry.style.display = 'none';
                }
            });
        });
    }
}

function filterLogs(filter) {
    var logsList = document.getElementById('logs-list');
    var logEntries = logsList.querySelectorAll('.log-entry');
    
    logEntries.forEach(function(entry) {
        if (filter === 'all') {
            entry.style.display = 'flex';
        } else if (entry.classList.contains(filter)) {
            entry.style.display = 'flex';
        } else {
            entry.style.display = 'none';
        }
    });
}

function addLogEntry(type, message) {
    var logsList = document.getElementById('logs-list');
    if (!logsList) return;
    
    var entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    
    var time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    var levelText = {
        success: 'SUCCESS',
        info: 'INFO',
        warning: 'WARNING',
        error: 'ERROR'
    };
    
    entry.innerHTML = 
        '<span class="log-time">' + time + '</span>' +
        '<span class="log-level">[' + levelText[type] + ']</span>' +
        '<span class="log-message">' + message + '</span>';
    
    logsList.insertBefore(entry, logsList.firstChild);
}

// =====================================================
// FILES
// =====================================================

function initFiles() {
    var folderItems = document.querySelectorAll('.folder-item');
    var fileItems = document.querySelectorAll('.file-item');
    
    folderItems.forEach(function(folder) {
        folder.addEventListener('click', function(e) {
            e.stopPropagation();
            folder.classList.toggle('expanded');
            var contents = folder.querySelector('.folder-contents');
            if (contents) {
                contents.style.display = folder.classList.contains('expanded') ? 'block' : 'none';
            }
        });
    });
    
    fileItems.forEach(function(file) {
        file.addEventListener('click', function() {
            fileItems.forEach(function(f) {
                f.classList.remove('active');
            });
            file.classList.add('active');
            var fileName = file.querySelector('.file-name').textContent;
            showToast('Selected: ' + fileName, 'info');
        });
    });
}

// =====================================================
// MODAL
// =====================================================

function initModal() {
    // Modal is handled in initExploits
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

function initToast() {
    // Toast container is always ready
}

function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    var icon = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = '<span class="toast-icon">' + icon[type] + '</span> ' + escapeHtml(message);
    container.appendChild(toast);
    
    setTimeout(function() {
        toast.classList.add('hiding');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =====================================================
// UPTIME COUNTER
// =====================================================

function initUptime() {
    var uptimeElement = document.getElementById('uptime');
    if (!uptimeElement) return;
    
    var startTime = Date.now() - (14 * 3600 + 32 * 60 + 7 * 1000);
    
    function updateUptime() {
        var elapsed = Date.now() - startTime;
        var days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        var hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        uptimeElement.textContent = 
            String(days).padStart(2, '0') + ':' +
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }
    
    updateUptime();
    setInterval(updateUptime, 1000);
}

// =====================================================
// TYPING EFFECT
// =====================================================

function initTypingEffect() {
    var typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    var text = typingElement.textContent;
    typingElement.textContent = '';
    var index = 0;
    
    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 1000);
}

// =====================================================
// RANDOM LOGS
// =====================================================

function initRandomLogs() {
    var messages = [
        'Packet intercepted from 10.0.0.88',
        'Firewall rule updated',
        'New vulnerability discovered',
        'Connection attempt detected',
        'Data encryption complete',
        'Port scan detected from 192.168.1.105',
        'New exploit module loaded',
        'Backup completed successfully'
    ];
    
    function randomSystemMessage() {
        var randomMsg = messages[Math.floor(Math.random() * messages.length)];
        addLogEntry('info', randomMsg);
    }
    
    setInterval(function() {
        if (Math.random() > 0.5) {
            randomSystemMessage();
        }
    }, 20000);
    
    // Keyboard shortcut for terminal
    document.addEventListener('keydown', function(e) {
        if (e.key === '`' || e.key === 'Escape') {
            var terminalInput = document.getElementById('terminal-input');
            if (terminalInput) {
                terminalInput.focus();
            }
        }
    });
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('System error:', e.message);
    });
    
    // Add startup logs
    setTimeout(function() {
        addLogEntry('success', 'System initialization complete');
    }, 500);
    
    setTimeout(function() {
        addLogEntry('info', 'Loading exploit database...');
    }, 1000);
    
    setTimeout(function() {
        addLogEntry('info', 'Establishing secure connection...');
    }, 1500);
    
    setTimeout(function() {
        addLogEntry('success', 'VPN tunnel established');
    }, 2000);
}
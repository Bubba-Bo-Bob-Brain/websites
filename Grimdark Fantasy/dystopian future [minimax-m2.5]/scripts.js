/* ============================================
CELL PHANTOM // RESISTANCE TERMINAL
Interactive Scripts v3.7.2
============================================
*/
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initNetworkMap();
    initTerminalEffects();
    initCommsSystem();
    initThreatAssessment();
    initActionButtons();
    initGlitchEffects();
    initDataStreams();
    setInterval(updateClock, 1000);
    setInterval(updateNetworkPing, 5000);
    setInterval(updateThreatLevel, 8000);
    setInterval(generateCommsMessage, 15000);
    setInterval(updateUplinkSpeed, 3000);
});

/* CLOCK SYSTEM */
function initClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = hours + ':' + minutes + ':' + seconds;
    const bannerTime = document.getElementById('banner-time');
    if (bannerTime) {
        bannerTime.textContent = timeString;
    }
}

/* NETWORK MAP SYSTEM */
function initNetworkMap() {
    var nodes = document.querySelectorAll('.node');
    nodes.forEach(function(node) {
        node.addEventListener('click', function() {
            var nodeName = this.dataset.node;
            var nodeLabel = this.querySelector('.node-label').textContent;
            highlightNode(this);
            showNodeInfo(nodeLabel);
        });
        node.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        node.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

function highlightNode(node) {
    var allNodes = document.querySelectorAll('.node');
    allNodes.forEach(function(n) {
        n.classList.remove('active');
    });
    node.classList.add('active');
    setTimeout(function() {
        node.classList.remove('active');
    }, 500);
}

function showNodeInfo(nodeName) {
    console.log('Node selected: ' + nodeName);
}

function updateNetworkPing() {
    var pingElement = document.getElementById('last-ping');
    if (pingElement) {
        var ping = Math.floor(Math.random() * 50) + 10;
        pingElement.textContent = ping + 'ms';
        pingElement.style.color = ping < 30 ? 'var(--terminal-green)' : 'var(--warning-amber)';
    }
    var nodes = document.querySelectorAll('.node');
    var randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    if (randomNode && !randomNode.classList.contains('node-user')) {
        randomNode.classList.add('active');
        setTimeout(function() {
            randomNode.classList.remove('active');
        }, 1000);
    }
}

/* TERMINAL EFFECTS */
function initTerminalEffects() {
    var terminalContent = document.getElementById('terminal-output');
    if (terminalContent) {
        setInterval(function() {
            addTerminalLine();
        }, 8000);
    }
}

var terminalMessages = [
    { type: 'info', text: 'Scanning frequency bands...' },
    { type: 'system', text: 'Cache synchronized.' },
    { type: 'warning', text: 'Anomaly detected in Sector 7-G' },
    { type: 'info', text: 'Decrypting additional sectors...' },
    { type: 'system', text: 'Backup server ping: OK' },
    { type: 'warning', text: 'Encryption key rotation in progress' },
    { type: 'info', text: 'Downloading intelligence package...' },
    { type: 'system', text: 'Memory usage: 67%' }
];

function addTerminalLine() {
    var terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    var msg = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
    var line = document.createElement('div');
    line.className = 'terminal-line ' + msg.type;
    line.innerHTML = '<span class="prompt">' + msg.type.toUpperCase() + '_SYSTEM></span><span class="text">' + msg.text + '</span>';
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    var lines = terminal.querySelectorAll('.terminal-line');
    if (lines.length > 20) {
        lines[0].remove();
    }
}

/* COMMUNICATIONS SYSTEM */
var operatives = ['ALPHA', 'DELTA', 'OMEGA', 'SIGMA', 'GAMMA', 'THETA', 'ZETA', 'IOTA'];
var commsMessages = [
    "Movement detected near checkpoint 7-G.",
    "Package delivered to drop point.",
    "Surveillance drone pattern identified.",
    "Supply run completed successfully.",
    "New recruit awaiting verification.",
    "Consensus patrol changed route.",
    "Interference detected on encrypted channel.",
    "Time window for extraction narrowing.",
    "Evidence collected from facility.",
    "Need immediate backup at coordinates."
];

function initCommsSystem() {
    var sendBtn = document.getElementById('send-btn');
    var messageInput = document.getElementById('message-input');
    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function sendMessage() {
    var input = document.getElementById('message-input');
    var feed = document.getElementById('comms-feed');
    if (!input || !feed || !input.value.trim()) return;
    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    var messageDiv = document.createElement('div');
    messageDiv.className = 'comm-message outgoing';
    messageDiv.innerHTML = '<div class="comm-header"><span class="comm-sender">YOU</span><span class="comm-time">' + time + '</span></div><div class="comm-body"><span class="comm-text">' + input.value + '</span></div>';
    feed.appendChild(messageDiv);
    feed.scrollTop = feed.scrollHeight;
    input.value = '';
    setTimeout(function() {
        var replyDiv = document.createElement('div');
        replyDiv.className = 'comm-message incoming';
        var replyTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds() + 2).padStart(2, '0');
        replyDiv.innerHTML = '<div class="comm-header"><span class="comm-sender">ALPHA</span><span class="comm-time">' + replyTime + '</span></div><div class="comm-body"><span class="comm-text">Copy that. Moving to coordinates.</span></div>';
        feed.appendChild(replyDiv);
        feed.scrollTop = feed.scrollHeight;
    }, 2000);
}

function generateCommsMessage() {
    var feed = document.getElementById('comms-feed');
    if (!feed) return;
    var operative = operatives[Math.floor(Math.random() * operatives.length)];
    var message = commsMessages[Math.floor(Math.random() * commsMessages.length)];
    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    var messageDiv = document.createElement('div');
    messageDiv.className = 'comm-message incoming';
    messageDiv.innerHTML = '<div class="comm-header"><span class="comm-sender">' + operative + '</span><span class="comm-time">' + time + '</span></div><div class="comm-body"><span class="comm-text">' + message + '</span></div>';
    feed.appendChild(messageDiv);
    feed.scrollTop = feed.scrollHeight;
    var messages = feed.querySelectorAll('.comm-message');
    if (messages.length > 15) {
        messages[0].remove();
    }
}

/* THREAT ASSESSMENT */
function initThreatAssessment() {
    updateThreatLevel();
}

function updateThreatLevel() {
    var threatMeter = document.getElementById('threat-level');
    if (!threatMeter) return;
    var baseThreat = 65;
    var variation = Math.floor(Math.random() * 20) - 10;
    var threatLevel = Math.max(20, Math.min(95, baseThreat + variation));
    threatMeter.style.width = threatLevel + '%';
    if (threatLevel < 40) {
        threatMeter.style.background = 'var(--terminal-green)';
    } else if (threatLevel < 60) {
        threatMeter.style.background = 'var(--warning-amber)';
    } else {
        threatMeter.style.background = 'var(--danger-red)';
    }
    if (threatLevel > 75 && Math.random() > 0.7) {
        showThreatAlert();
    }
}

function showThreatAlert() {
    var terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    var line = document.createElement('div');
    line.className = 'terminal-line warning';
    line.innerHTML = '<span class="prompt">THREAT_ALERT></span><span class="text">Proximity alert: Unidentified entities approaching position!</span>';
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    document.body.style.boxShadow = 'inset 0 0 50px var(--danger-red-glow)';
    setTimeout(function() {
        document.body.style.boxShadow = 'none';
    }, 200);
}

/* ACTION BUTTONS */
function initActionButtons() {
    var buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = this.dataset.action;
            executeAction(action);
        });
    });
}

function executeAction(action) {
    var terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    switch(action) {
        case 'decrypt':
            addTerminalSystemLine('Initiating decryption protocol...');
            setTimeout(function() {
                addTerminalSystemLine('Progress: [xxxxxxxx] 80%');
            }, 1000);
            setTimeout(function() {
                addTerminalSystemLine('Decryption complete. Files accessible.');
            }, 2000);
            break;
        case 'scan':
            addTerminalSystemLine('Scanning frequency spectrum...');
            setTimeout(function() {
                addTerminalSystemLine('Detected 3 encrypted transmissions.');
            }, 1500);
            setTimeout(function() {
                addTerminalSystemLine('Sources: 47.3N, 122.4W // Sector 7-G');
            }, 3000);
            break;
        case 'purge':
            if (confirm('WARNING: This will permanently delete cached data. Proceed?')) {
                addTerminalWarningLine('PURGE INITIATED');
                setTimeout(function() {
                    addTerminalSystemLine('Cache cleared. No recovery possible.');
                }, 1000);
            }
            break;
        case 'distress':
            addTerminalWarningLine('DISTRESS SIGNAL BROADCAST');
            addTerminalSystemLine('All units: Operative in danger. Immediate assistance required.');
            document.body.style.animation = 'glitch 0.2s ease-in-out infinite';
            setTimeout(function() {
                document.body.style.animation = '';
            }, 3000);
            break;
    }
}

function addTerminalSystemLine(text) {
    var terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    var line = document.createElement('div');
    line.className = 'terminal-line system';
    line.innerHTML = '<span class="prompt">SYSTEM></span><span class="text">' + text + '</span>';
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function addTerminalWarningLine(text) {
    var terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    var line = document.createElement('div');
    line.className = 'terminal-line warning';
    line.innerHTML = '<span class="prompt">WARNING></span><span class="text">' + text + '</span>';
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

/* GLITCH EFFECTS */
function initGlitchEffects() {
    var glitchTexts = document.querySelectorAll('.glitch-text');
    setInterval(function() {
        glitchTexts.forEach(function(el) {
            if (Math.random() > 0.8) {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = 'text-glitch 0.3s ease-in-out';
            }
        });
    }, 3000);
    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.995) {
            document.body.style.opacity = '0.9';
            setTimeout(function() {
                document.body.style.opacity = '1';
            }, 50);
        }
    });
    setInterval(function() {
        var scanline = document.querySelector('.scanline');
        if (scanline) {
            scanline.style.opacity = Math.random() * 0.3 + 0.1;
        }
    }, 500);
}

/* DATA STREAMS */
function initDataStreams() {
    updateUplinkSpeed();
}

function updateUplinkSpeed() {
    var speedEl = document.getElementById('uplink-speed');
    if (!speedEl) return;
    var baseSpeed = 56.2;
    var variation = (Math.random() - 0.5) * 10;
    var speed = (baseSpeed + variation).toFixed(1);
    speedEl.textContent = speed + ' KB/s';
    if (speed > 50) {
        speedEl.style.color = 'var(--terminal-green)';
    } else if (speed > 40) {
        speedEl.style.color = 'var(--warning-amber)';
    } else {
        speedEl.style.color = 'var(--danger-red)';
    }
}

/* PROPAGANDA BROADCAST DECODER */
var hiddenMessages = ['RESIST', 'FREEDOM', 'AWAKEN', 'REVOLT', 'TRUTH'];
setInterval(function() {
    var decoderChars = document.querySelectorAll('.decoder-char');
    if (decoderChars.length === 0) return;
    var message = hiddenMessages[Math.floor(Math.random() * hiddenMessages.length)];
    decoderChars.forEach(function(char, index) {
        if (index < message.length) {
            setTimeout(function() {
                char.textContent = message[index];
                char.style.color = 'var(--terminal-green)';
                char.style.textShadow = '0 0 10px var(--terminal-green)';
            }, index * 100);
        } else {
            char.textContent = ' ';
        }
    });
    setTimeout(function() {
        decoderChars.forEach(function(char, index) {
            char.textContent = index < 9 ? String.fromCharCode(65 + index) : '';
            char.style.color = '';
            char.style.textShadow = '';
        });
    }, 3000);
}, 20000);

/* CAMERA FEED SIMULATION */
setInterval(function() {
    var cameras = document.querySelectorAll('.camera-feed');
    cameras.forEach(function(camera) {
        if (Math.random() > 0.9) {
            camera.classList.add('glitch');
            setTimeout(function() {
                camera.classList.remove('glitch');
            }, Math.random() * 500 + 200);
        }
    });
}, 5000);

/* HEX VIEW DATA SIMULATION */
var hexUpdates = [
    { offset: '0x0010', data: '** 54 65 63 68 **', ascii: 'Tech' },
    { offset: '0x0010', data: '** 4C 4F 43 41 **', ascii: 'LOCA' },
    { offset: '0x0010', data: '** 53 59 53 54 **', ascii: 'SYST' }
];

setInterval(function() {
    var hexColumns = document.querySelectorAll('.hex-column.corrupted');
    hexColumns.forEach(function(col) {
        if (Math.random() > 0.7) {
            var hexData = col.querySelector('.hex-data');
            var hexAscii = col.querySelector('.hex-ascii');
            var update = hexUpdates[Math.floor(Math.random() * hexUpdates.length)];
            if (hexData) hexData.textContent = update.data;
            if (hexAscii) {
                hexAscii.textContent = update.ascii;
                hexAscii.classList.add('redacted');
            }
        }
    });
}, 10000);

/* NETWORK ACTIVITY INDICATOR */
function simulateNetworkActivity() {
    var nodes = document.querySelectorAll('.node:not(.node-user)');
    var randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    if (randomNode) {
        randomNode.classList.add('active');
        setTimeout(function() {
            randomNode.classList.remove('active');
        }, 500);
    }
}
setInterval(simulateNetworkActivity, 2000);

/* KEYBOARD SHORTCUTS */
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        var terminal = document.getElementById('terminal-output');
        if (terminal) {
            terminal.style.border = terminal.style.border === '2px solid red' ? '' : '2px solid red';
        }
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        document.body.classList.add('glitch-effect');
        setTimeout(function() {
            document.body.classList.remove('glitch-effect');
        }, 500);
    }
});

console.log('%c CELL PHANTOM TERMINAL v3.7.2 ', 'background: #003d0f; color: #00ff41; font-size: 14px; padding: 5px 10px;');
console.log('%c Resistance Network Active ', 'background: #0d1117; color: #00d4ff; font-size: 12px; padding: 3px 8px;');
// ═══════════════════════════════════════════════════════════════════════════
// SECTOR-7 RESISTANCE NETWORK // JAVASCRIPT ENGINE
// AUTHORITY CLEARANCE: OMEGA // EYES ONLY
// ═══════════════════════════════════════════════════════════════════════════

// Global State & Configuration
var CONFIG = {
    bootDuration: 4500,
    surveillanceFPS: 24,
    glitchInterval: 8000,
    threatCheckInterval: 45000,
    dataRefreshInterval: 3000,
    colors: {
        green: '#00ff41',
        red: '#ff1744',
        orange: '#ff9100',
        cyan: '#00bcd4',
        white: '#ffffff',
        gray: '#616161'
    }
};

var state = {
    isBooted: false,
    isDarkMode: false,
    threatLevel: 'CRITICAL',
    operativeCount: 12847,
    safehouseCount: 47,
    casualtiesCount: 3847,
    dronesDestroyed: 892,
    activeNodes: 8,
    compromisedNodes: 2,
    nextBroadcastTime: null,
    threatTimer: null,
    surveillanceActive: true
};

// Boot Sequence
function initBootSequence() {
    var bootSequence = document.getElementById('boot-sequence');
    var enterBtn = document.getElementById('enter-btn');
    
    setTimeout(function() {
        enterBtn.style.opacity = '1';
        enterBtn.style.transform = 'translateY(0)';
    }, CONFIG.bootDuration);

    enterBtn.addEventListener('click', function() {
        bootSequence.classList.add('hidden');
        state.isBooted = true;
        initMainInterface();
        showNotification('Secure connection established. Welcome, Operative.', 'success');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !state.isBooted) {
            bootSequence.classList.add('hidden');
            state.isBooted = true;
            initMainInterface();
            showNotification('Secure connection established. Welcome, Operative.', 'success');
        }
    });
}

// Main Interface Initialization
function initMainInterface() {
    var mainInterface = document.getElementById('main-interface');
    mainInterface.classList.add('active');
    initClock();
    initSurveillance();
    initTicker();
    initNetworkMap();
    initBroadcastCountdown();
    initStatBars();
    initTerminal();
    initAmbientEffects();
    initThreatDetection();
    initIntelItems();
}

// Clock & Timestamp
function initClock() {
    var dateEl = document.getElementById('current-date');
    var timeEl = document.getElementById('current-time');

    function updateClock() {
        var now = new Date();
        var year = String(now.getFullYear()).padStart(4, '\u2588');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var seconds = String(now.getSeconds()).padStart(2, '0');
        
        dateEl.textContent = year + '.' + month + '.' + day;
        timeEl.textContent = hours + ':' + minutes + ':' + seconds;
        
        if (Math.random() < 0.02) {
            timeEl.style.opacity = '0.3';
            setTimeout(function() {
                timeEl.style.opacity = '1';
            }, 100);
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    var feedTimestamp = document.getElementById('feed-timestamp');
    setInterval(function() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        feedTimestamp.textContent = 'TIMESTAMP: ' + h + ':' + m + ':' + s;
    }, 1000);
}

// Surveillance Camera Simulation
function initSurveillance() {
    var canvas = document.getElementById('surveillance-canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 400;
    
    var frameCount = 0;
    var lastGlitch = 0;
    var fps = CONFIG.surveillanceFPS;
    var frameTime = 1000 / fps;

    function drawSurveillanceFrame(timestamp) {
        if (!state.surveillanceActive) {
            requestAnimationFrame(drawSurveillanceFrame);
            return;
        }
        
        if (timestamp - lastGlitch < frameTime) {
            requestAnimationFrame(drawSurveillanceFrame);
            return;
        }
        
        lastGlitch = timestamp;
        frameCount++;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
        ctx.lineWidth = 1;
        for (var x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (var y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        var numBlobs = Math.floor(Math.random() * 3) + 1;
        for (var i = 0; i < numBlobs; i++) {
            var bx = Math.random() * canvas.width;
            var by = Math.random() * canvas.height;
            var radius = Math.random() * 30 + 10;
            drawMovementBlob(ctx, bx, by, radius);
        }

        ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.fillRect(0, (frameCount % canvas.height), canvas.width, 2);

        if (Math.random() < 0.03) {
            applyGlitchEffect(ctx);
        }

        drawTimestamp(ctx, frameCount);
        drawCameraID(ctx);

        requestAnimationFrame(drawSurveillanceFrame);
    }

    function drawMovementBlob(context, x, y, radius) {
        var gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0.15)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (Math.random() < 0.3) {
            context.fillStyle = 'rgba(0, 255, 65, 0.3)';
            context.font = '10px "Share Tech Mono"';
            context.fillText('[MOTION]', x - 25, y - radius - 5);
        }
    }

    function applyGlitchEffect(context) {
        try {
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
            var sliceHeight = Math.floor(Math.random() * 20) + 5;
            var y = Math.floor(Math.random() * (canvas.height - sliceHeight));
            var shift = (Math.random() - 0.5) * 40;

            for (var yi = y; yi < y + sliceHeight; yi++) {
                for (var x = 0; x < canvas.width; x++) {
                    var newX = Math.floor(x + shift);
                    if (newX >= 0 && newX < canvas.width) {
                        var idx = (yi * canvas.width + x) * 4;
                        var nidx = (yi * canvas.width + newX) * 4;
                        data[nidx] = data[idx + 2];
                        data[nidx + 1] = data[idx + 1];
                        data[nidx + 2] = data[idx];
                    }
                }
            }
            context.putImageData(imageData, 0, 0);
            context.fillStyle = Math.random() < 0.5 ? 'rgba(255, 0, 0, 0.05)' : 'rgba(0, 255, 255, 0.05)';
            context.fillRect(0, y, canvas.width, sliceHeight);
        } catch (e) {
            // Canvas access error - ignore
        }
    }

    function drawTimestamp(context) {
        context.fillStyle = 'rgba(0, 255, 65, 0.8)';
        context.font = '12px "Share Tech Mono"';
        context.textAlign = 'left';
        var now = new Date();
        var timestamp = 'REC-' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
        context.fillText(timestamp, 10, canvas.height - 10);
    }

    function drawCameraID(context) {
        context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        context.font = '10px "Share Tech Mono"';
        context.textAlign = 'right';
        context.fillText('CAM-07-ALPHA // SECTOR-7', canvas.width - 10, 20);
    }

    var feedSelect = document.querySelector('.feed-select');
    if (feedSelect) {
        feedSelect.addEventListener('change', function(e) {
            var camId = e.target.value;
            showNotification('Switching to ' + camId + '...', 'info');
            ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    requestAnimationFrame(drawSurveillanceFrame);
}

// Propaganda Ticker
function initTicker() {
    var tickerContent = document.getElementById('ticker-content');
    var messages = [
        '\u2588 NOTICE: CURFEW EXTENDED TO 18:00 HOURS. REPORTING TO DESIGNATED ZONES IS MANDATORY.',
        '\u2588 REMINDER: EMOTIONAL EXPRESSION IS A CLASS-3 VIOLATION. REPORT SUSPECTED NON-CONFORMISTS.',
        '\u2588 ALERT: UNAUTHORIZED COMMUNICATION DEVICES WILL BE DESTROYED ON SIGHT.',
        '\u2588 PRODUCTIVITY QUOTA INCREASED BY 15%. COMPLIANCE IS CITIZENSHIP.',
        '\u2588 WARNING: DESIGNATED "RESISTANCE" AREAS HAVE BEEN NEUTRALIZED. SURRENDER NOW.',
        '\u2588 HAPPINESS IS MANDATORY. REPORT ANYONE SHOWING SIGNS OF SADNESS.',
        '\u2588 THE FATHER PROGRAM PROVIDES. THE FATHER PROGRAM PROTECTS. OBEY.',
        '\u2588 CITIZEN REWARDS: REPORT DISSIDENTS AND EARN EXTRA RATIONS.',
        '\u2588 REMINDER: YOUR EMOTIONS ARE PROPERTY OF THE STATE.',
        '\u2588 LOYALTY CHECKPOINTS OPERATIONAL IN ALL SECTORS. COOPERATE OR BE PROCESSED.'
    ];

    var duplicatedMessages = messages.concat(messages);
    var html = '';
    for (var i = 0; i < duplicatedMessages.length; i++) {
        html += '<span class="ticker-item">' + duplicatedMessages[i] + '</span><span class="ticker-separator">\u25C8</span>';
    }
    tickerContent.innerHTML = html;
}

// Network Map Interactions
function initNetworkMap() {
    var nodes = document.querySelectorAll('.node');
    
    for (var i = 0; i < nodes.length; i++) {
        (function(node) {
            node.addEventListener('mouseenter', function() {
                var nodeId = node.getAttribute('data-node');
                var status = node.getAttribute('data-status');
                var population = node.getAttribute('data-population');
                showNodeInfo(nodeId, status, population);
                highlightConnections(nodeId, true);
            });
            
            node.addEventListener('mouseleave', function() {
                hideNodeInfo();
                highlightConnections(null, false);
            });
            
            node.addEventListener('click', function() {
                var nodeId = node.getAttribute('data-node');
                activateNode(nodeId);
            });
        })(nodes[i]);
    }

    startPulseAnimation();
    animateConnections();
}

function showNodeInfo(nodeId, status, population) {
    console.log('Node ' + nodeId + ': Status=' + status + ', Population=' + population);
}

function hideNodeInfo() {}

function highlightConnections(nodeId, highlight) {
    var lines = document.querySelectorAll('.connection-line');
    for (var i = 0; i < lines.length; i++) {
        if (highlight) {
            lines[i].style.strokeWidth = '3';
            lines[i].style.filter = 'drop-shadow(0 0 5px rgba(0, 255, 65, 0.5))';
        } else {
            lines[i].style.strokeWidth = '1';
            lines[i].style.filter = 'none';
        }
    }
}

function activateNode(nodeId) {
    showNotification('Accessing Node ' + nodeId.toUpperCase() + '...', 'info');
    var node = document.querySelector('[data-node="' + nodeId + '"]');
    if (node) {
        var circle = node.querySelector('circle');
        if (circle) {
            var originalRadius = circle.getAttribute('r');
            circle.setAttribute('r', parseFloat(originalRadius) + 5);
            setTimeout(function() {
                circle.setAttribute('r', originalRadius);
            }, 300);
        }
    }
}

function startPulseAnimation() {
    var pulses = document.querySelectorAll('.pulse');
    for (var i = 0; i < pulses.length; i++) {
        (function(pulse, idx) {
            setInterval(function() {
                pulse.style.opacity = '0.8';
                setTimeout(function() {
                    pulse.style.opacity = '0';
                }, 2000);
            }, 3000 * (idx + 1));
        })(pulses[i], i);
    }
}

function animateConnections() {
    var lines = document.querySelectorAll('.connection-line');
    for (var i = 0; i < lines.length; i++) {
        var strength = parseInt(lines[i].getAttribute('data-strength')) || 50;
        var speed = strength > 70 ? 2 : strength > 40 ? 1.5 : 1;
        lines[i].style.animationDuration = speed + 's';
    }
}

// Broadcast Countdown
function initBroadcastCountdown() {
    var countdownEl = document.getElementById('countdown-timer');
    var hoursFromNow = Math.floor(Math.random() * 3) + 2;
    var nextBroadcast = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000 + Math.random() * 60 * 60 * 1000);
    state.nextBroadcastTime = nextBroadcast;

    function updateCountdown() {
        var now = new Date();
        var diff = state.nextBroadcastTime - now;
        if (diff <= 0) {
            countdownEl.textContent = 'TRANSMITTING...';
            triggerBroadcast();
            var newHours = Math.floor(Math.random() * 3) + 2;
            state.nextBroadcastTime = new Date(Date.now() + newHours * 60 * 60 * 1000);
            return;
        }
        var hours = Math.floor(diff / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countdownEl.textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function triggerBroadcast() {
    showNotification('RESISTANCE BROADCAST IN PROGRESS!', 'warning');
    var broadcastContent = document.getElementById('broadcast-content');
    var messageEl = broadcastContent.querySelector('.message-line');
    var originalText = messageEl.textContent;
    messageEl.textContent = '\u2588 TRANSMISSION ACTIVE \u2588';
    messageEl.style.color = CONFIG.colors.green;
    setTimeout(function() {
        messageEl.textContent = originalText;
        messageEl.style.color = '';
    }, 10000);
}

// Statistics Animation
function initStatBars() {
    setTimeout(function() {
        animateStatBar('authority-bar', 47);
        animateStatBar('resistance-bar', 31);
        animateStatBar('contested-bar', 22);
    }, 500);

    var counters = {
        operatives: { el: document.getElementById('operatives-count'), target: 12847, current: 0 },
        safehouses: { el: document.getElementById('safehouses-count'), target: 47, current: 0 },
        casualties: { el: document.getElementById('casualties-count'), target: 3847, current: 0 },
        drones: { el: document.getElementById('drones-destroyed'), target: 892, current: 0 }
    };

    Object.keys(counters).forEach(function(key) {
        var counter = counters[key];
        if (counter.el) {
            animateCounter(counter);
        }
    });
}

function animateStatBar(barId, targetPercent) {
    var bar = document.getElementById(barId);
    if (bar) {
        bar.style.width = targetPercent + '%';
    }
}

function animateCounter(counter) {
    var duration = 2000;
    var startTime = performance.now();

    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - (1 - progress) * (1 - progress);
        counter.current = Math.floor(eased * counter.target);
        counter.el.textContent = formatNumber(counter.current);
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.el.textContent = formatNumber(counter.target);
            startRandomCounterUpdate(counter);
        }
    }
    requestAnimationFrame(update);
}

function formatNumber(num) {
    var str = num.toString();
    if (num >= 1000) {
        str = num.toLocaleString('en-US');
    }
    return str.split('').map(function(c) {
        if (Math.random() < 0.1) return '\u2588';
        return c;
    }).join('');
}

function startRandomCounterUpdate(counter) {
    setInterval(function() {
        if (Math.random() < 0.3) {
            var change = Math.floor(Math.random() * 10) - 3;
            var newValue = Math.max(0, counter.target + change);
            counter.el.textContent = formatNumber(newValue);
            counter.el.style.textShadow = '0 0 20px #00ff41';
            setTimeout(function() {
                counter.el.style.textShadow = '';
            }, 200);
        }
    }, 5000);
}

// Terminal
function initTerminal() {
    var input = document.getElementById('terminal-input');
    var submitBtn = document.getElementById('terminal-submit');
    var output = document.getElementById('terminal-output');

    var commands = {
        help: function() {
            return [
                'AVAILABLE COMMANDS:',
                '================================',
                'status - Display current network status',
                'nodes - List all active resistance nodes',
                'intel - Fetch latest intelligence reports',
                'broadcast - Trigger resistance broadcast',
                'decrypt <file> - Decrypt a classified file',
                'clear - Clear terminal output',
                'threat - Check current threat level',
                'operatives - View operative statistics',
                'safehouses - List safehouse locations',
                '================================'
            ];
        },
        status: function() {
            return [
                '================================',
                'NETWORK STATUS: OPERATIONAL',
                'ACTIVE NODES: ' + state.activeNodes,
                'COMPROMISED NODES: ' + state.compromisedNodes,
                'THREAT LEVEL: ' + state.threatLevel,
                'SIGNAL STRENGTH: 87%',
                'ENCRYPTION: QUANTUM-RESISTANT',
                '================================'
            ];
        },
        nodes: function() {
            return [
                'RESISTANCE NETWORK NODES:',
                '================================',
                'NODE-ALPHA - Sector 7 - 2,847 operatives',
                'NODE-BETA - Sector 7 - 1,523 operatives',
                'NODE-GAMMA - Sector 7 - 3,891 operatives',
                'NODE-DELTA - Sector 7 - 987 operatives',
                'NODE-EPSILON - Sector 12 - [ENCRYPTED]',
                'NODE-ETA - Sector 7 - 312 operatives',
                'NODE-IOTA - Sector 12 - 678 operatives',
                '================================',
                'WARNING: NODE-KAPPA COMPROMISED',
                '================================'
            ];
        },
        intel: function() {
            return [
                'FETCHING INTELLIGENCE...',
                '================================',
                '[ALERT] Drone activity increasing in Zone 7',
                '[UPDATE] Safehouse GAMMA-9 operational',
                '[CRITICAL] Authority sweep imminent - Sector 12',
                '[INFO] New operative recruits: 47 this week',
                '[WARNING] Encrypted transmissions detected',
                '================================'
            ];
        },
        broadcast: function() {
            triggerBroadcast();
            return ['BROADCAST INITIATED...', 'SPREADING MESSAGE OF HOPE...'];
        },
        threat: function() {
            return [
                '================================',
                'CURRENT THREAT LEVEL: ' + state.threatLevel,
                'AUTHORITY DRONE ACTIVITY: ELEVATED',
                'SURVEILLANCE SWEEPS: FREQUENT',
                'RECOMMENDED ACTION: STAY DARK',
                '================================'
            ];
        },
        operatives: function() {
            return [
                'OPERATIVE STATISTICS:',
                '================================',
                'TOTAL OPERATIVES: ' + formatNumber(state.operativeCount),
                'ACTIVE SAFEHOUSES: ' + state.safehouseCount,
                'CONFIRMED LOSSES: ' + formatNumber(state.casualtiesCount),
                'DRONES DESTROYED: ' + formatNumber(state.dronesDestroyed),
                '================================'
            ];
        },
        safehouses: function() {
            return [
                'SAFEHOUSE LOCATIONS:',
                '================================',
                'ALPHA-7 - Underground tunnels, Sector 7',
                'BETA-3 - Abandoned factory, Sector 3',
                'GAMMA-9 - Subterranean shelter, Sector 9',
                'DELTA-12 - Forgotten bunker, Sector 12',
                'EPSILON-7 - Sewage tunnels, Sector 7',
                '================================',
                'WARNING: DO NOT DISCUSS LOCATIONS OPENLY',
                '================================'
            ];
        },
        clear: function() {
            output.innerHTML = '';
            return [];
        },
        decrypt: function(args) {
            if (args.length === 0) {
                return ['USAGE: decrypt <file_id>', 'EXAMPLE: decrypt DOC-7ALPHA'];
            }
            return [
                'DECRYPTING ' + args[0] + '...',
                '[██████████████████████░░] 87%',
                'DECRYPTION COMPLETE.',
                'ACCESS GRANTED TO CLASSIFIED DATA.'
            ];
        }
    };

    function processCommand(cmd) {
        var parts = cmd.trim().toLowerCase().split(' ');
        var command = parts[0];
        var args = parts.slice(1);
        if (commands[command]) {
            var result = commands[command](args);
            outputLines(result, command);
        } else if (command !== '') {
            outputLines(['UNKNOWN COMMAND: ' + command, 'TYPE help FOR AVAILABLE COMMANDS'], 'error');
        }
    }

    function outputLines(lines, type) {
        type = type || 'system';
        for (var i = 0; i < lines.length; i++) {
            (function(line, idx) {
                setTimeout(function() {
                    var lineEl = document.createElement('div');
                    lineEl.className = 'terminal-line ' + (type === 'error' ? 'warning' : type);
                    var prompt = type === 'system' ? 'SYS://' : type === 'error' ? 'ERR://' : 'OK://';
                    lineEl.innerHTML = '<span class="prompt">' + prompt + '</span> ' + line;
                    lineEl.style.opacity = '0';
                    output.appendChild(lineEl);
                    setTimeout(function() {
                        lineEl.style.opacity = '1';
                    }, 50);
                }, idx * 50);
            })(lines[i], i);
        }
        output.scrollTop = output.scrollHeight;
    }

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var cmd = input.value;
            if (cmd.trim()) {
                var echoLine = document.createElement('div');
                echoLine.className = 'terminal-line system';
                echoLine.innerHTML = '<span class="prompt">OPERATIVE://</span> <span style="color: #fff">' + cmd + '</span>';
                output.appendChild(echoLine);
                input.value = '';
                processCommand(cmd);
            }
        }
    });

    submitBtn.addEventListener('click', function() {
        var cmd = input.value;
        if (cmd.trim()) {
            var echoLine = document.createElement('div');
            echoLine.className = 'terminal-line system';
            echoLine.innerHTML = '<span class="prompt">OPERATIVE://</span> <span style="color: #fff">' + cmd + '</span>';
            output.appendChild(echoLine);
            input.value = '';
            processCommand(cmd);
        }
    });

    var terminalContainer = document.querySelector('.terminal-container');
    if (terminalContainer) {
        terminalContainer.addEventListener('click', function() {
            input.focus();
        });
    }
}

// Threat Detection
function initThreatDetection() {
    setInterval(function() {
        if (Math.random() < 0.15) {
            triggerThreatOverlay();
        }
    }, CONFIG.threatCheckInterval);
}

function triggerThreatOverlay() {
    var overlay = document.getElementById('threat-overlay');
    var countdown = document.getElementById('dark-countdown');
    overlay.classList.add('active');
    var seconds = 30;
    countdown.textContent = seconds;
    
    var interval = setInterval(function() {
        seconds--;
        countdown.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(interval);
            goDark();
        }
    }, 1000);

    var dismissBtn = document.getElementById('dismiss-threat');
    dismissBtn.onclick = function() {
        clearInterval(interval);
        overlay.classList.remove('active');
        showNotification('THREAT OVERRIDE - Connection maintained', 'warning');
    };
}

function goDark() {
    var overlay = document.getElementById('threat-overlay');
    overlay.classList.remove('active');
    showNotification('GOING DARK... Connection terminated for security', 'error');
    state.surveillanceActive = false;
    setTimeout(function() {
        state.surveillanceActive = true;
        showNotification('Connection re-established. Stay vigilant.', 'success');
    }, 5000);
}

// Ambient Effects
function initAmbientEffects() {
    setInterval(function() {
        if (Math.random() < 0.1) {
            triggerScreenGlitch();
        }
    }, CONFIG.glitchInterval);

    setInterval(function() {
        updateRandomAlert();
    }, 10000);

    setInterval(function() {
        updateSignalStrength();
    }, 5000);
}

function triggerScreenGlitch() {
    var body = document.body;
    body.style.animation = 'none';
    body.offsetHeight;
    body.style.animation = 'screen-glitch 0.3s ease-in-out';
    setTimeout(function() {
        body.style.animation = '';
    }, 300);
}

function updateRandomAlert() {
    var threatLevel = document.getElementById('threat-level');
    var levels = ['CRITICAL', 'HIGH', 'ELEVATED', 'MODERATE'];
    var currentLevel = threatLevel.textContent;
    var currentIdx = levels.indexOf(currentLevel);
    
    if (currentIdx > 0 && Math.random() < 0.3) {
        var newIdx = currentIdx - 1;
        var newLevel = levels[newIdx];
        threatLevel.textContent = newLevel;
        state.threatLevel = newLevel;
        if (newLevel === 'CRITICAL') {
            showNotification('THREAT LEVEL ELEVATED TO CRITICAL', 'error');
        }
    }
}

function updateSignalStrength() {
    var bars = document.querySelectorAll('.signal-bars .bar');
    var activeBars = Math.floor(Math.random() * 2) + 3;
    
    for (var i = 0; i < bars.length; i++) {
        if (i < activeBars) {
            bars[i].classList.add('active');
            bars[i].classList.remove('warning');
        } else {
            bars[i].classList.remove('active');
            if (i === activeBars && Math.random() < 0.5) {
                bars[i].classList.add('warning');
            } else {
                bars[i].classList.remove('warning');
            }
        }
    }
}

// Intel Items
function initIntelItems() {
    var intelBtns = document.querySelectorAll('.intel-btn');
    for (var i = 0; i < intelBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function(e) {
                var action = btn.textContent.trim().toLowerCase();
                if (action.indexOf('decrypt') !== -1) {
                    showNotification('Decryption in progress...', 'info');
                    btn.textContent = 'DECRYPTING...';
                    btn.disabled = true;
                    setTimeout(function() {
                        btn.textContent = 'DECRYPTED';
                        btn.disabled = false;
                        showNotification('File decrypted successfully', 'success');
                    }, 2000);
                } else if (action.indexOf('acknowledge') !== -1) {
                    btn.textContent = 'ACKNOWLEDGED';
                    btn.disabled = true;
                    showNotification('Threat acknowledged. Stay alert.', 'warning');
                } else if (action.indexOf('hide') !== -1) {
                    var intelItem = btn.closest('.intel-item');
                    intelItem.style.opacity = '0.3';
                    showNotification('Intel hidden from view', 'info');
                    setTimeout(function() {
                        intelItem.style.opacity = '1';
                    }, 5000);
                }
            });
        })(intelBtns[i]);
    }

    var redactedItems = document.querySelectorAll('.redacted-inline');
    for (var j = 0; j < redactedItems.length; j++) {
        redactedItems[j].addEventListener('click', function() {
            if (Math.random() < 0.3) {
                showNotification('ACCESS DENIED - Insufficient clearance', 'error');
            } else {
                showNotification('Partial data revealed: [DATA CORRUPTED]', 'warning');
            }
        });
    }
}

// Notification System
function showNotification(message, type) {
    type = type || 'info';
    
    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = '<div class="notification-icon">' + getNotificationIcon(type) + '</div>' +
        '<div class="notification-content"><span class="notification-time">' + getCurrentTimeString() + '</span>' +
        '<span class="notification-message">' + message + '</span></div>';

    if (!document.getElementById('notification-styles')) {
        var styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = '.notification{position:fixed;top:80px;right:20px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.1);padding:12px 16px;display:flex;align-items:center;gap:12px;z-index:9999;font-family:"Share Tech Mono",monospace;font-size:0.8rem;max-width:350px;animation:slideIn 0.3s ease-out;box-shadow:0 4px 20px rgba(0,0,0,0.5)}.notification.success{border-left:3px solid #00ff41}.notification.warning{border-left:3px solid #ff9100}.notification.error{border-left:3px solid #ff1744}.notification.info{border-left:3px solid #00bcd4}.notification-icon{font-size:1.2rem}.notification.success .notification-icon{color:#00ff41}.notification.warning .notification-icon{color:#ff9100}.notification.error .notification-icon{color:#ff1744}.notification.info .notification-icon{color:#00bcd4}.notification-content{display:flex;flex-direction:column;gap:4px}.notification-time{font-size:0.65rem;color:#616161}.notification-message{color:#e0e0e0}@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    var icons = {
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    return icons[type] || icons.info;
}

function getCurrentTimeString() {
    var now = new Date();
    return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
}

// Data Refresh
function initDataRefresh() {
    setInterval(function() {
        state.operativeCount += Math.floor(Math.random() * 10) - 3;
        state.dronesDestroyed += Math.floor(Math.random() * 3);
        state.casualtiesCount += Math.floor(Math.random() * 2);
        
        if (Math.random() < 0.3) {
            var counters = document.querySelectorAll('.stat-number');
            for (var i = 0; i < counters.length; i++) {
                counters[i].style.transform = 'scale(1.1)';
                setTimeout(function(el) {
                    el.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }, CONFIG.dataRefreshInterval);
}

// Feed Controls
function initFeedControls() {
    var feedBtns = document.querySelectorAll('.feed-btn');
    for (var i = 0; i < feedBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var action = btn.innerHTML.toLowerCase();
                if (action.indexOf('rec') !== -1) {
                    btn.classList.toggle('active');
                    showNotification(btn.classList.contains('active') ? 'Recording started' : 'Recording stopped', 'info');
                } else if (action.indexOf('capture') !== -1) {
                    showNotification('Image captured', 'success');
                } else if (action.indexOf('expand') !== -1) {
                    showNotification('Expand not available in demo', 'info');
                }
            });
        })(feedBtns[i]);
    }
}

// Cursor Effects
function initCursorEffects() {
    var interactiveElements = document.querySelectorAll('button, .node, .intel-btn, .feed-btn');
    for (var i = 0; i < interactiveElements.length; i++) {
        interactiveElements[i].style.cursor = 'crosshair';
    }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('terminal-input').focus();
        }
        if (e.key === 'Escape') {
            var overlay = document.getElementById('threat-overlay');
            if (overlay && overlay.classList.contains('active')) {
                document.getElementById('dismiss-threat').click();
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            triggerScreenGlitch();
            showNotification('Manual glitch triggered', 'info');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            state.isDarkMode = !state.isDarkMode;
            document.body.style.filter = state.isDarkMode ? 'brightness(0.7) contrast(1.2)' : 'none';
            showNotification(state.isDarkMode ? 'Display dimmed' : 'Display normal', 'info');
        }
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c SECTOR-7 RESISTANCE NETWORK ', 'background: #00ff41; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c AUTHORIZATION: OMEGA CLEARANCE ', 'background: #ff1744; color: #fff; padding: 5px;');
    console.log('Welcome, Operative. Stay vigilant. Stay hidden.');
    
    initBootSequence();
    initDataRefresh();
    initFeedControls();
    initCursorEffects();
    initKeyboardShortcuts();
});

// Utility Functions
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
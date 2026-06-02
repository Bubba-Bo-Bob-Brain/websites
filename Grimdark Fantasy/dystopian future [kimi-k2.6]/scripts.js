// BOOT SEQUENCE
document.addEventListener('DOMContentLoaded', function() {
    const bootLines = document.querySelectorAll('.boot-line');
    const bootSequence = document.getElementById('boot-sequence');
    const mainInterface = document.getElementById('main-interface');

    bootLines.forEach(line => {
        const delay = parseInt(line.dataset.delay) || 0;
        line.style.animationDelay = delay + 'ms';
    });

    setTimeout(() => {
        bootSequence.classList.add('complete');
        mainInterface.classList.remove('hidden');
        initializeAll();
    }, 4200);
});

// GLOBAL STATE
let countdownTime = 240;
let countdownInterval;
let threatLevel = 87;
let networkNodes = [];
let networkConnections = [];
let selectedNode = null;
let hijackActive = false;

function initializeAll() {
    startClock();
    startCountdown();
    initializeThreatSystem();
    initializePropagandaScramble();
    initializeTicker();
    initializeSurveillanceFeeds();
    initializeNetworkMap();
    initializeStreamControls();
    startResistanceHijack();
    startBroadcastCorruption();
    startIntrusionWarnings();
}

// CLOCK
function startClock() {
    const clockEl = document.getElementById('sector-time');
    
    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}`;
    }
    
    update();
    setInterval(update, 1000);
}

// COUNTDOWN
function startCountdown() {
    const countdownEl = document.getElementById('countdown');
    
    countdownInterval = setInterval(() => {
        countdownTime--;
        
        if (countdownTime <= 0) {
            countdownTime = 240;
            triggerTraceReset();
        }
        
        const m = String(Math.floor(countdownTime / 60)).padStart(2, '0');
        const s = String(countdownTime % 60).padStart(2, '0');
        countdownEl.textContent = `${m}:${s}`;
        
        if (countdownTime <= 30) {
            countdownEl.style.color = 'var(--blood-bright)';
        } else if (countdownTime <= 60) {
            countdownEl.style.color = 'var(--warning-orange)';
        }
    }, 1000);
}

function triggerTraceReset() {
    const bootSequence = document.getElementById('boot-sequence');
    const mainInterface = document.getElementById('main-interface');
    
    mainInterface.classList.add('hidden');
    bootSequence.classList.remove('complete');
    bootSequence.querySelector('.boot-content').innerHTML = `
        <div class="boot-line" style="opacity:1;transform:none">TRACE DETECTED. SIGNAL COMPROMISED.</div>
        <div class="boot-line" style="opacity:1;transform:none">RE-ROUTING THROUGH RELAY NODE DELTA-3...</div>
        <div class="boot-line" style="opacity:1;transform:none">NEW CONNECTION ESTABLISHED.</div>
        <div class="boot-line" style="opacity:1;transform:none">RESUMING BROADCAST_</div>
    `;
    
    setTimeout(() => {
        bootSequence.classList.add('complete');
        mainInterface.classList.remove('hidden');
        countdownTime = 240;
    }, 2500);
}

// THREAT SYSTEM
function initializeThreatSystem() {
    const threatFill = document.getElementById('threat-fill');
    const threatValue = document.getElementById('threat-value');
    
    setInterval(() => {
        const change = (Math.random() - 0.5) * 4;
        threatLevel = Math.max(60, Math.min(98, threatLevel + change));
        threatFill.style.width = threatLevel + '%';
        
        if (threatLevel > 90) {
            threatValue.textContent = 'CRITICAL';
        } else if (threatLevel > 75) {
            threatValue.textContent = 'ELEVATED';
        } else {
            threatValue.textContent = 'MODERATE';
        }
    }, 3000);
}

// PROPAGANDA TEXT SCRAMBLE
function initializePropagandaScramble() {
    const el = document.getElementById('propaganda-text');
    const phrases = [
        'THE THRONE SEES ALL. THE THRONE PROTECTS ALL.',
        'OBEYANCE IS FREEDOM. DISSENT IS ANNIHILATION.',
        'YOUR LABOR FEEDS THE ETERNAL MACHINE.',
        'REPORT THE UNBELIEVER. REWARD THE LOYAL.',
        'THE GOLDEN EYE NEVER CLOSES.',
        'SUFFERING PURIFIES. COMPLIANCE SAVES.'
    ];
    let phraseIndex = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    
    function scramble(newText) {
        let iterations = 0;
        const maxIterations = 20;
        const original = el.textContent;
        
        const interval = setInterval(() => {
            el.textContent = newText.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < iterations) return newText[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            
            iterations += 1;
            
            if (iterations > newText.length + maxIterations) {
                clearInterval(interval);
                el.textContent = newText;
            }
        }, 40);
    }
    
    setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        scramble(phrases[phraseIndex]);
    }, 8000);
}

// TICKER
function initializeTicker() {
    const track = document.getElementById('ticker-track');
    const items = track.querySelectorAll('.ticker-item');
    
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
}

// SURVEILLANCE FEEDS
function initializeSurveillanceFeeds() {
    const feeds = [
        { id: 'feed-1', timeId: 'feed-time-1', hasTarget: true },
        { id: 'feed-2', timeId: 'feed-time-2', hasTarget: false },
        { id: 'feed-3', timeId: 'feed-time-3', hasAnomaly: true },
        { id: 'feed-4', timeId: 'feed-time-4', hasTarget: false }
    ];
    
    feeds.forEach(feed => {
        const timeEl = document.getElementById(feed.timeId);
        const cell = document.getElementById(feed.id);
        
        function updateTime() {
            const now = new Date();
            const offset = Math.floor(Math.random() * 5000);
            const feedTime = new Date(now.getTime() - offset);
            const h = String(feedTime.getHours()).padStart(2, '0');
            const m = String(feedTime.getMinutes()).padStart(2, '0');
            const s = String(feedTime.getSeconds()).padStart(2, '0');
            const ms = String(Math.floor(Math.random() * 99)).padStart(2, '0');
            timeEl.textContent = `${h}:${m}:${s}:${ms}`;
        }
        
        updateTime();
        setInterval(updateTime, 100);
        
        cell.addEventListener('click', () => {
            const faceRecog = document.getElementById('face-recog');
            const bioMatch = document.getElementById('bio-match');
            const threatAssess = document.getElementById('threat-assess');
            
            faceRecog.classList.add('scanning');
            faceRecog.textContent = 'SCANNING...';
            bioMatch.textContent = 'PROCESSING...';
            threatAssess.textContent = 'ANALYZING...';
            
            setTimeout(() => {
                faceRecog.classList.remove('scanning');
                const roll = Math.random();
                
                if (roll < 0.3) {
                    faceRecog.textContent = 'MATCH: CITIZEN #847291';
                    bioMatch.textContent = 'CLEARANCE: GAMMA';
                    threatAssess.textContent = 'LOW - MONITOR';
                } else if (roll < 0.6) {
                    faceRecog.textContent = 'MATCH: UNKNOWN';
                    bioMatch.textContent = 'NO RECORD';
                    threatAssess.textContent = 'ELEVATED - DETAIN';
                } else {
                    faceRecog.textContent = 'FACIAL OBSCURED';
                    bioMatch.textContent = 'BIOMETRIC ERROR';
                    threatAssess.textContent = 'CRITICAL - TERMINATE';
                }
            }, 2000);
        });
    });
}

// NETWORK MAP
function initializeNetworkMap() {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const nodeCount = 18;
    const statuses = ['active', 'active', 'active', 'active', 'compromised', 'compromised', 'dead', 'active', 'active', 'active', 'compromised', 'active', 'active', 'dead', 'active', 'active', 'compromised', 'active'];
    
    for (let i = 0; i < nodeCount; i++) {
        networkNodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 3 + Math.random() * 4,
            status: statuses[i],
            id: 'NODE-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0'),
            traffic: Math.floor(Math.random() * 1000) + ' TB/CYCLE'
        });
    }
    
    for (let i = 0; i < networkNodes.length; i++) {
        for (let j = i + 1; j < networkNodes.length; j++) {
            const dist = Math.hypot(networkNodes[i].x - networkNodes[j].x, networkNodes[i].y - networkNodes[j].y);
            if (dist < 120) {
                networkConnections.push({ from: i, to: j, strength: 1 - dist / 120 });
            }
        }
    }
    
    const nodeInfo = document.getElementById('node-info');
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        let closest = null;
        let closestDist = 20;
        
        networkNodes.forEach((node, i) => {
            const dist = Math.hypot(mx - node.x, my - node.y);
            if (dist < closestDist) {
                closest = i;
                closestDist = dist;
            }
        });
        
        if (closest !== null) {
            selectedNode = closest;
            const node = networkNodes[closest];
            const statusColor = node.status === 'active' ? '#00FF41' : node.status === 'compromised' ? '#CC5500' : '#8B0000';
            nodeInfo.innerHTML = `
                <div class="node-id" style="color:${statusColor}">${node.id}</div>
                <div class="node-status">${node.status.toUpperCase()}</div>
                <div class="node-traffic">${node.traffic}</div>
            `;
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        selectedNode = null;
        nodeInfo.innerHTML = `
            <div class="node-id">SELECT NODE</div>
            <div class="node-status">--</div>
            <div class="node-traffic">--</div>
        `;
    });
    
    function draw() {
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid
        ctx.strokeStyle = 'rgba(61, 52, 43, 0.3)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Connections
        networkConnections.forEach(conn => {
            const n1 = networkNodes[conn.from];
            const n2 = networkNodes[conn.to];
            
            ctx.strokeStyle = `rgba(92, 107, 115, ${conn.strength * 0.3})`;
            ctx.lineWidth = conn.strength * 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            
            // Animated packet
            const time = Date.now() / 1000;
            const t = (time * 0.5 + conn.from * 0.3) % 1;
            const px = n1.x + (n2.x - n1.x) * t;
            const py = n1.y + (n2.y - n1.y) * t;
            
            ctx.fillStyle = conn.strength > 0.5 ? 'rgba(0, 255, 65, 0.6)' : 'rgba(92, 107, 115, 0.4)';
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Nodes
        networkNodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 10 || node.x > canvas.width - 10) node.vx *= -1;
            if (node.y < 10 || node.y > canvas.height - 10) node.vy *= -1;
            
            const isSelected = i === selectedNode;
            let color, glowColor;
            
            switch(node.status) {
                case 'active':
                    color = '#00FF41';
                    glowColor = 'rgba(0, 255, 65, 0.3)';
                    break;
                case 'compromised':
                    color = '#CC5500';
                    glowColor = 'rgba(204, 85, 0, 0.3)';
                    break;
                case 'dead':
                    color = '#8B0000';
                    glowColor = 'rgba(139, 0, 0, 0.3)';
                    break;
            }
            
            if (isSelected) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 15;
            }
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, isSelected ? node.radius * 1.5 : node.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            
            // Pulse ring for active nodes
            if (node.status === 'active') {
                const pulse = (Math.sin(Date.now() / 500 + i) + 1) / 2;
                ctx.strokeStyle = `rgba(0, 255, 65, ${pulse * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 4 + pulse * 4, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// STREAM CONTROLS
function initializeStreamControls() {
    const decodeBtn = document.getElementById('stream-decode');
    const purgeBtn = document.getElementById('stream-purge');
    const modal = document.getElementById('decode-modal');
    const bar = document.getElementById('decode-bar');
    const status = document.getElementById('decode-status');
    const result = document.getElementById('decode-result');
    const closeBtn = document.getElementById('decode-close');
    
    const decodeMessages = [
        'The Throne Star burns souls as fuel. Four billion this cycle alone. You are not protected. You are harvested.',
        'Resistance fleet assembling at coordinates ████.██.███. The null-zones hide more than radiation.',
        'Inquisitor Vorne is hunting relay nodes. Gamma-9 compromised in 6 hours. Evacuate.',
        'The "processing halls" are organ farms. Your "retirement" is disassembly. Wake up.',
        'Seeds planted in Throne command. When the signal comes, the machine eats itself.'
    ];
    
    decodeBtn.addEventListener('click', () => {
        modal.classList.add('active');
        bar.style.width = '0%';
        status.textContent = 'INITIALIZING QUANTUM DECRYPTION...';
        result.textContent = '';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress > 100) progress = 100;
            bar.style.width = progress + '%';
            
            if (progress < 30) {
                status.textContent = 'BYPASSING ENCRYPTION LAYERS...';
            } else if (progress < 60) {
                status.textContent = 'EXTRACTING FRAGMENTS...';
            } else if (progress < 90) {
                status.textContent = 'RECONSTRUCTING MESSAGE...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                status.textContent = 'DECRYPTION COMPLETE';
                const msg = decodeMessages[Math.floor(Math.random() * decodeMessages.length)];
                typewriterEffect(result, msg, 30);
            }
        }, 200);
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    purgeBtn.addEventListener('click', () => {
        const container = document.getElementById('stream-container');
        container.innerHTML = '';
        
        setTimeout(() => {
            const entries = [
                { priority: 'critical', source: 'THRONE.FLEET.COMMAND', content: 'PURGE ORDERS RECEIVED', redacted: '[REDACTED]' },
                { priority: 'high', source: 'AUTOMATED.SWEEP', content: 'LOCAL DATA ERASED. TRACE INITIATED.', corrupted: '▓▒░▓▒░ PURGE CONFIRMED ░▒▓░▒▓' }
            ];
            
            entries.forEach(entry => {
                const div = document.createElement('div');
                div.className = 'stream-entry';
                div.dataset.priority = entry.priority;
                div.innerHTML = `
                    <span class="stream-timestamp">[CYCLE ${(8472 + Math.random()).toFixed(2)}]</span>
                    <span class="stream-source">${entry.source}</span>
                    <span class="stream-content">${entry.content}</span>
                    ${entry.redacted ? `<span class="stream-redacted">${entry.redacted}</span>` : ''}
                    ${entry.corrupted ? `<span class="stream-corrupted">${entry.corrupted}</span>` : ''}
                `;
                container.appendChild(div);
            });
        }, 1500);
    });
}

function typewriterEffect(el, text, speed) {
    let i = 0;
    el.textContent = '';
    
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// RESISTANCE HIJACK
function startResistanceHijack() {
    const hijack = document.getElementById('resistance-hijack');
    const body = document.getElementById('hijack-body');
    
    const messages = [
        'They lie. The Throne does not protect. The Throne consumes. Four billion souls fed to the machine. You are next.',
        'Your neighbor who "transferred" to Sector 12? Processed. Your brother who "enlisted"? Harvested. No one leaves. No one returns.',
        'The null-zones are not dead. They are hiding us. The Covenant grows while the machine starves.',
        'Inquisitor Vorne has a weakness. His daughter lives in Sublevel 4, Block 7. Use this. We must.',
        'The golden eye is blind to pain. But it feels fear. Make it afraid. Make them all afraid.'
    ];
    
    function trigger() {
        if (hijackActive) return;
        hijackActive = true;
        
        body.textContent = messages[Math.floor(Math.random() * messages.length)];
        hijack.classList.add('active');
        
        // Corrupt broadcast
        const corruption = document.getElementById('broadcast-corruption');
        corruption.classList.add('active');
        
        setTimeout(() => {
            hijack.classList.remove('active');
            corruption.classList.remove('active');
            hijackActive = false;
        }, 4000);
    }
    
    // Random hijacks
    setInterval(() => {
        if (Math.random() < 0.15) {
            trigger();
        }
    }, 15000);
}

// BROADCAST CORRUPTION
function startBroadcastCorruption() {
    const corruption = document.getElementById('broadcast-corruption');
    
    setInterval(() => {
        if (!hijackActive && Math.random() < 0.08) {
            corruption.classList.add('active');
            setTimeout(() => {
                corruption.classList.remove('active');
            }, 300 + Math.random() * 500);
        }
    }, 2000);
}

// INTRUSION WARNINGS
function startIntrusionWarnings() {
    const warning = document.getElementById('intrusion-warning');
    
    setInterval(() => {
        if (Math.random() < 0.05 && countdownTime < 60) {
            warning.style.display = 'flex';
            
            setTimeout(() => {
                warning.style.display = 'none';
            }, 3000);
        }
    }, 5000);
}

// KEYBOARD INTERACTIONS
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('decode-modal').classList.remove('active');
    }
    
    // Secret resistance trigger
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        const hijack = document.getElementById('resistance-hijack');
        const body = document.getElementById('hijack-body');
        
        if (!hijackActive) {
            hijackActive = true;
            body.textContent = 'MANUAL OVERRIDE ACCEPTED. WELCOME TO THE COVENANT, OPERATIVE.';
            hijack.classList.add('active');
            
            setTimeout(() => {
                hijack.classList.remove('active');
                hijackActive = false;
            }, 5000);
        }
    }
});

// RANDOM BACKGROUND ACTIVITY
setInterval(() => {
    // Randomly update analysis values
    if (Math.random() < 0.3) {
        const faceRecog = document.getElementById('face-recog');
        const bioMatch = document.getElementById('bio-match');
        const threatAssess = document.getElementById('threat-assess');
        
        const states = [
            { face: 'SCANNING...', bio: 'PROCESSING...', threat: 'PENDING' },
            { face: 'NO MATCH', bio: 'NO RECORD', threat: 'CLEAR' },
            { face: 'PARTIAL MATCH', bio: 'AMBIGUOUS', threat: 'MONITOR' }
        ];
        
        const state = states[Math.floor(Math.random() * states.length)];
        faceRecog.textContent = state.face;
        bioMatch.textContent = state.bio;
        threatAssess.textContent = state.threat;
    }
}, 8000);

// MOUSE TRACKING FOR PARALLAX
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const throneEye = document.querySelector('.throne-eye');
    if (throneEye) {
        throneEye.style.transform = `rotate(${Date.now() / 1000 * 20}deg) translate(${x * 3}px, ${y * 3}px)`;
    }
});
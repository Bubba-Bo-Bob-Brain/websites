const BOOT_MESSAGES = [
  "BIOS DATE 01/15/2087 14:22:51 VER 9.2.0",
  "CPU: NEURAL-7 QUANTUM PROCESSOR @ 12.8 PHz",
  "DETECTED: 8192 TB Q-RAM",
  "INITIALIZING GHOST_PROTOCOL KERNEL...",
  "LOADING ENCRYPTION MODULES: AES-4096, QUANTUM-SHIELD",
  "MOUNTING VIRTUAL FILESYSTEMS...",
  "ESTABLISHING DARKNET CONNECTION...",
  "PROXY CHAIN: TOKYO > BERLIN > SAO_PAULO > REYKJAVIK",
  "VERIFYING DIGITAL SIGNATURES...",
  "WARNING: COUNTER-INTRUSION SYSTEMS ACTIVE",
  "DEPLOYING POLYMORPHIC SHELLCODE...",
  "BYPASSING INTRUSION DETECTION...",
  "CONNECTION ESTABLISHED. WELCOME, OPERATIVE."
];

const TERMINAL_COMMANDS = {
  help: () => [
    "AVAILABLE COMMANDS:",
    "  scan        - Scan target for vulnerabilities",
    "  breach      - Initiate breach protocol",
    "  trace       - Trace network route",
    "  decrypt     - Decrypt intercepted data",
    "  inject      - Deploy payload to target",
    "  wipe        - Clear operation logs",
    "  status      - Show system status",
    "  nodes       - List active network nodes",
    "  evade       - Activate counter-surveillance",
    "  ghost       - Emergency disconnect",
    "  clear       - Clear terminal output",
    ""
  ],
  scan: () => {
    startBreachProgress();
    return [
      "[SCAN] Initiating port sweep on gov.secure...",
      "[...]  PORT 22/tcp   OPEN   SSH-9.2 PROTOCOL",
      "[...]  PORT 443/tcp  OPEN   HTTPS QUANTUM-TLS",
      "[...]  PORT 8080/tcp OPEN   PROXY GATEWAY",
      "[...]  PORT 9001/tcp FILTERED UNKNOWN SERVICE",
      "[OK]  3 vectors identified. Recommending breach via port 8080.",
      ""
    ];
  },
  breach: () => {
    triggerGlitch();
    return [
      "[BREACH] Deploying zero-day exploit CVE-2087-9941...",
      "[...]  Bypassing firewall rules...",
      "[OK]  Firewall bypassed via packet fragmentation",
      "[...]  Elevating privileges...",
      "[OK]  ROOT access acquired",
      "[WARN] COUNTER-INTRUSION DETECTED - TRACE IN PROGRESS",
      "[...]  Deploying decoy packets...",
      "[OK]  Session secured with quantum tunnel",
      ""
    ];
  },
  trace: () => [
    "[TRACE] Tracing route to target...",
    "  1  0.2ms  ghost-node-7f3a.darknet",
    "  2  12ms   tor-exit.tokyo.jp",
    "  3  45ms   relay.berlin.de",
    "  4  89ms   proxy.saopaulo.br",
    "  5  134ms  * * * REQUEST TIMED OUT",
    "  6  201ms  * * * REQUEST TIMED OUT",
    "  7  156ms  gov.secure [REDACTED]",
    "[OK] Trace complete. 2 hops blackholed.",
    ""
  ],
  decrypt: () => {
    animateMatrix();
    return [
      "[DECRYPT] Loading quantum decryption keys...",
      "[...]  Brute-forcing AES-4096...",
      "[...]  Q-bit alignment: 99.7%",
      "[OK]  KEY FRAGMENT RECOVERED: 7a3f...e9d2",
      "[...]  Decrypting payload...",
      "[OK]  2.4 TB OF CLASSIFIED DATA EXTRACTED",
      "[INFO] Documents tagged: PROJECT_OMEGA, BLACK_SITES, ASSET_LIST",
      ""
    ];
  },
  inject: () => [
    "[INJECT] Crafting polymorphic payload...",
    "[...]  Morphing signature to avoid detection...",
    "[OK]  Payload staged: WORM/GHOST_v9.2.7",
    "[...]  Delivering via HTTPS tunnel...",
    "[OK]  Payload delivered. Persistence established.",
    "[...]  Opening reverse shell on port 31337...",
    "[OK]  SHELL ACTIVE. WAITING FOR COMMANDS.",
    ""
  ],
  wipe: () => [
    "[WIPE] Initiating log sanitization...",
    "[...]  Overwriting /var/log/auth.log...",
    "[...]  Scrubbing packet captures...",
    "[...]  Purging DNS cache...",
    "[...]  Rewriting inode timestamps...",
    "[OK]  847 LOG ENTRIES PERMANENTLY ERASED",
    "[OK]  FORENSIC RESISTANCE: MAXIMUM",
    ""
  ],
  status: () => [
    "[STATUS] SYSTEM DIAGNOSTICS",
    "  UPTIME:      14d 07:23:11",
    "  MEMORY:      2.4 GB / 32 GB",
    "  CPU LOAD:    14%",
    "  NETWORK:     847 MB/s",
    "  PROXIES:     7 ACTIVE HOPS",
    "  ENCRYPTION:  QUANTUM-AES-4096",
    "  SIGNATURE:   POLYMORPHIC",
    "  DETECTION:   0.03% PROBABILITY",
    ""
  ],
  nodes: () => [
    "[NODES] ACTIVE NETWORK INFRASTRUCTURE",
    "  [✓] megacorp.local    COMPROMISED  12ms",
    "  [✓] finance.global    COMPROMISED  34ms",
    "  [◉] gov.secure        BREACHING    PENDING",
    "  [✗] black.ice         LOCKED       ---",
    "  [✗] mil.defense       LOCKED       ---",
    ""
  ],
  evade: () => {
    triggerGlitch();
    return [
      "[EVADE] ACTIVATING COUNTER-SURVEILLANCE...",
      "[...]  Rotating proxy chain...",
      "[OK]  New chain: REYKJAVIK > HELSINKI > SINGAPORE",
      "[...]  Spoofing MAC addresses...",
      "[OK]  Identity camouflage active",
      "[...]  Launching decoy connections...",
      "[OK]  847 DECOYS DEPLOYED",
      "[WARN] TRACE NEUTRALIZED. YOU ARE GHOST.",
      ""
    ];
  },
  ghost: () => {
    setTimeout(() => location.reload(), 2000);
    return [
      "[GHOST] EMERGENCY DISCONNECT INITIATED",
      "[...]  Terminating all sessions...",
      "[...]  Purging memory buffers...",
      "[...]  Overwriting encryption keys...",
      "[OK]  ALL TRACES ELIMINATED",
      "[...]  GOODBYE, OPERATIVE.",
      ""
    ];
  },
  clear: () => {
    clearTerminal();
    return null;
  }
};

let breachProgress = 0;
let breachInterval = null;

function initBootSequence() {
  const bootText = document.getElementById('bootText');
  const bootBar = document.getElementById('bootBar');
  const bootSequence = document.getElementById('bootSequence');
  const mainInterface = document.getElementById('mainInterface');
  
  let msgIndex = 0;
  let charIndex = 0;
  
  function typeNextChar() {
    if (msgIndex >= BOOT_MESSAGES.length) {
      setTimeout(() => {
        bootSequence.classList.add('hidden');
        mainInterface.classList.add('active');
        initAllSystems();
      }, 500);
      return;
    }
    
    const msg = BOOT_MESSAGES[msgIndex];
    if (charIndex === 0) {
      bootText.textContent += '> ';
    }
    
    if (charIndex < msg.length) {
      bootText.textContent += msg[charIndex];
      charIndex++;
      const progress = ((msgIndex * msg.length + charIndex) / (BOOT_MESSAGES.length * 40)) * 100;
      bootBar.style.width = Math.min(progress, 100) + '%';
      setTimeout(typeNextChar, Math.random() * 15 + 5);
    } else {
      bootText.textContent += '\n';
      msgIndex++;
      charIndex = 0;
      setTimeout(typeNextChar, 100);
    }
  }
  
  typeNextChar();
}

function initAllSystems() {
  initCodeRain();
  initPacketStream();
  initNetworkMap();
  initMatrixDisplay();
  initClock();
  initTerminal();
  initHexDecoration();
  startLogFeed();
  startPingUpdates();
  startResourceUpdates();
  startCoordinateUpdates();
  setInterval(() => addNotification('warning', 'IDS signature update received'), 25000);
  setInterval(() => addNotification('success', 'Proxy node rotated successfully'), 40000);
}

function initCodeRain() {
  const canvas = document.getElementById('codeRain');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF';
  const fontSize = 14;
  const columns = Math.ceil(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);
  
  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#39ff14';
    ctx.font = fontSize + 'px "Share Tech Mono"';
    
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.fillText(char, x, y);
      
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

function initPacketStream() {
  const canvas = document.getElementById('packetStream');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 30;
    canvas.height = 140;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const packets = [];
  const maxPackets = 50;
  
  function addPacket() {
    if (packets.length < maxPackets) {
      packets.push({
        x: 0,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.7 ? '#39ff14' : Math.random() > 0.5 ? '#00e5ff' : '#ffaa00'
      });
    }
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(12, 12, 12, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() > 0.7) addPacket();
    
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.x += p.speed;
      
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(p.x, p.y, p.size * 4, p.size);
      
      ctx.globalAlpha = 0.3;
      ctx.fillRect(p.x - 10, p.y, p.size * 2, p.size);
      
      if (p.x > canvas.width) {
        packets.splice(i, 1);
      }
    }
    
    ctx.globalAlpha = 1;
    
    ctx.strokeStyle = '#39ff14';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

function initNetworkMap() {
  const canvas = document.getElementById('netMapCanvas');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 30;
    canvas.height = 160;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const nodes = [
    { x: 0.15, y: 0.5, r: 6, label: 'GHOST', color: '#39ff14' },
    { x: 0.4, y: 0.3, r: 5, label: 'TOKYO', color: '#00e5ff' },
    { x: 0.5, y: 0.7, r: 5, label: 'BERLIN', color: '#00e5ff' },
    { x: 0.65, y: 0.4, r: 5, label: 'SAO_PAULO', color: '#00e5ff' },
    { x: 0.8, y: 0.6, r: 5, label: 'REYKJAVIK', color: '#00e5ff' },
    { x: 0.92, y: 0.5, r: 7, label: 'TARGET', color: '#ffaa00' }
  ];
  
  const pulses = [];
  
  function addPulse() {
    pulses.push({ t: 0, from: 0, to: 1 });
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(12, 12, 12, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() > 0.95) addPulse();
    
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i].x * canvas.width, nodes[i].y * canvas.height);
      ctx.lineTo(nodes[i + 1].x * canvas.width, nodes[i + 1].y * canvas.height);
      ctx.stroke();
    }
    
    for (const p of pulses) {
      p.t += 0.015;
      if (p.t > 1) {
        p.t = 0;
        p.from = (p.from + 1) % (nodes.length - 1);
        p.to = p.from + 1;
      }
      
      const fromNode = nodes[p.from];
      const toNode = nodes[p.to];
      const x = fromNode.x * canvas.width + (toNode.x - fromNode.x) * canvas.width * p.t;
      const y = fromNode.y * canvas.height + (toNode.y - fromNode.y) * canvas.height * p.t;
      
      ctx.fillStyle = '#39ff14';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    for (const node of nodes) {
      const nx = node.x * canvas.width;
      const ny = node.y * canvas.height;
      
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(nx, ny, node.r + 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = node.color;
      ctx.font = '10px "Share Tech Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + node.r + 14);
    }
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  
  draw();
}

function initMatrixDisplay() {
  const rows = document.querySelectorAll('.matrix-row');
  const hexChars = '0123456789ABCDEF';
  
  rows.forEach((row, ri) => {
    for (let i = 0; i < 12; i++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.textContent = hexChars[Math.floor(Math.random() * 16)];
      row.appendChild(cell);
    }
  });
}

function animateMatrix() {
  const rows = document.querySelectorAll('.matrix-row');
  
  rows.forEach((row, ri) => {
    setTimeout(() => {
      const cells = row.querySelectorAll('.matrix-cell');
      cells.forEach((cell, ci) => {
        setTimeout(() => {
          cell.classList.add('encrypted');
          setTimeout(() => {
            cell.classList.remove('encrypted');
            cell.classList.add('active');
            setTimeout(() => cell.classList.remove('active'), 400);
          }, 200);
        }, ci * 80);
      });
    }, ri * 200);
  });
}

function initClock() {
  const timeEl = document.getElementById('systemTime');
  
  function update() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  update();
  setInterval(update, 1000);
}

function initTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  
  input.focus();
  input.addEventListener('blur', () => setTimeout(() => input.focus(), 10));
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      
      addTerminalLine('root@ghost:~# ' + cmd, 'command');
      
      if (TERMINAL_COMMANDS[cmd]) {
        const lines = TERMINAL_COMMANDS[cmd]();
        if (lines) {
          lines.forEach((line, i) => {
            setTimeout(() => addTerminalLine(line, 'output'), i * 80);
          });
        }
      } else if (cmd) {
        addTerminalLine('gh0st: command not found: ' + cmd, 'output');
        addTerminalLine('Type "help" for available commands.', 'output');
      }
    }
  });
}

function addTerminalLine(text, type) {
  const output = document.getElementById('terminalOutput');
  const line = document.createElement('div');
  line.className = 'term-line ' + type;
  
  if (type === 'command') {
    line.innerHTML = '<span class="prompt">root@ghost:~#</span>' + text.substring(16);
  } else if (text.includes('[WARN]') || text.includes('WARNING')) {
    line.className += ' warning';
    line.textContent = text;
  } else if (text.includes('[DANGER]') || text.includes('EMERGENCY')) {
    line.className += ' danger';
    line.textContent = text;
  } else {
    line.textContent = text;
  }
  
  output.appendChild(line);
  const body = document.getElementById('terminalBody');
  body.scrollTop = body.scrollHeight;
}

function clearTerminal() {
  document.getElementById('terminalOutput').innerHTML = '';
}

function initHexDecoration() {
  const container = document.getElementById('hexDecoration');
  
  for (let i = 0; i < 6; i++) {
    const hex = document.createElement('div');
    hex.style.cssText = `
      position: absolute;
      width: ${80 + i * 40}px;
      height: ${80 + i * 40}px;
      border: 1px solid rgba(57, 255, 20, ${0.04 + i * 0.02});
      transform: rotate(${i * 15}deg);
      top: 50%;
      left: 50%;
      margin-top: ${-(40 + i * 20)}px;
      margin-left: ${-(40 + i * 20)}px;
      animation: hexSpin ${20 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''};
    `;
    container.appendChild(hex);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes hexSpin {
      from { transform: rotate(0deg) translate(-50%, -50%); }
      to { transform: rotate(360deg) translate(-50%, -50%); }
    }
  `;
  document.head.appendChild(style);
}

function startBreachProgress() {
  if (breachInterval) return;
  
  breachInterval = setInterval(() => {
    breachProgress += Math.random() * 3;
    if (breachProgress >= 100) {
      breachProgress = 100;
      clearInterval(breachInterval);
      breachInterval = null;
      addNotification('success', 'BREACH COMPLETE: Target compromised');
    }
    
    const bar = document.getElementById('breachBar');
    const percent = document.getElementById('breachPercent');
    if (bar && percent) {
      bar.style.width = breachProgress + '%';
      percent.textContent = Math.floor(breachProgress) + '%';
    }
  }, 500);
}

function startLogFeed() {
  const logs = [
    { type: 'info', text: 'Packet filter updated: 2048 new signatures' },
    { type: 'success', text: 'Decoy server deployed: honeypot-7f3a.active' },
    { type: 'warning', text: 'Anomalous traffic detected on port 9001' },
    { type: 'info', text: 'Quantum key rotation: cycle 847 complete' },
    { type: 'success', text: 'Memory implant verified: no tampering' },
    { type: 'warning', text: 'Proxy node saopaulo.br latency spike: 234ms' },
    { type: 'danger', text: 'COUNTER-INTRUSION TRACE: ORIGIN MASKED' },
    { type: 'info', text: 'Blockchain notarization: op_hash verified' },
    { type: 'success', text: 'Stealth tunnel: 847 days without detection' }
  ];
  
  const feed = document.getElementById('logFeed');
  
  setInterval(() => {
    const log = logs[Math.floor(Math.random() * logs.length)];
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + log.type;
    entry.textContent = log.text;
    feed.appendChild(entry);
    
    if (feed.children.length > 8) {
      feed.removeChild(feed.firstChild);
    }
    
    feed.scrollTop = feed.scrollHeight;
  }, 3500);
}

function startPingUpdates() {
  const pingEl = document.getElementById('pingIndicator');
  
  setInterval(() => {
    const ping = Math.floor(Math.random() * 40) + 12;
    pingEl.textContent = 'PING: ' + ping + 'ms';
  }, 2000);
}

function startResourceUpdates() {
  const memEl = document.getElementById('memUsage');
  const cpuEl = document.getElementById('cpuUsage');
  const netEl = document.getElementById('netUsage');
  
  setInterval(() => {
    memEl.textContent = (Math.random() * 4 + 1).toFixed(1);
    cpuEl.textContent = Math.floor(Math.random() * 30 + 5);
    netEl.textContent = Math.floor(Math.random() * 400 + 600);
  }, 3000);
}

function startCoordinateUpdates() {
  const coordEl = document.getElementById('coordinates');
  
  setInterval(() => {
    const lat = (Math.random() * 180 - 90).toFixed(4);
    const lon = (Math.random() * 360 - 180).toFixed(4);
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lon >= 0 ? 'E' : 'W';
    coordEl.textContent = Math.abs(lat) + '°' + ns + ', ' + Math.abs(lon) + '°' + ew;
  }, 8000);
}

function triggerGlitch() {
  const overlay = document.getElementById('glitchOverlay');
  overlay.classList.add('active');
  setTimeout(() => overlay.classList.remove('active'), 300);
}

function addNotification(type, message) {
  const area = document.getElementById('notificationArea');
  const notif = document.createElement('div');
  notif.className = 'notification ' + type;
  notif.textContent = message;
  area.appendChild(notif);
  
  setTimeout(() => {
    if (notif.parentNode) {
      notif.parentNode.removeChild(notif);
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', initBootSequence);
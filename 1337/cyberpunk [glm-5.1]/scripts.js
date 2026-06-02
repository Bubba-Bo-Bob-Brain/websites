const BootSequence = {
  el: document.getElementById('bootSequence'),
  lines: document.querySelectorAll('.boot-line'),
  mainContent: document.getElementById('mainContent'),

  init() {
    this.lines.forEach((line, i) => {
      const delay = parseInt(line.dataset.delay) || 0;
      setTimeout(() => {
        line.classList.add('visible');
      }, delay);
    });

    const totalDelay = 1500 + 800;
    setTimeout(() => {
      this.el.classList.add('fade-out');
      setTimeout(() => {
        this.el.classList.add('hidden');
        this.mainContent.classList.add('visible');
        HeroTyping.init();
        Dashboard.init();
        HexGrid.init();
        WaveVisualizer.init();
        NetworkTopology.init();
        GlitchEffect.init();
        ScrollReveal.init();
      }, 800);
    }, totalDelay);
  }
};

const CodeRain = {
  canvas: document.getElementById('codeRain'),
  ctx: null,
  columns: [],
  fontSize: 14,
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:<>?/~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾑﾕﾗｾﾈｽﾀﾇﾍ',

  init() {
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = [];
    for (let i = 0; i < colCount; i++) {
      this.columns[i] = Math.random() * this.canvas.height / this.fontSize;
    }
  },

  animate() {
    this.ctx.fillStyle = 'rgba(5, 5, 5, 0.06)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = this.fontSize + 'px monospace';

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      const brightness = Math.random();
      if (brightness > 0.95) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00ff41';
      } else if (brightness > 0.7) {
        this.ctx.fillStyle = '#00ff41';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#00ff41';
      } else {
        this.ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillText(char, x, y);
      this.ctx.shadowBlur = 0;

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }

    requestAnimationFrame(() => this.animate());
  }
};

const HeroTyping = {
  el: document.getElementById('heroTyping'),
  phrases: [
    'Bypassing firewall protocols...',
    'Establishing encrypted tunnel...',
    'Root access granted.',
    'Intercepting data stream...',
    'Decrypting AES-256 payload...',
    'Scanning network nodes...',
    'Deploying zero-day exploit...',
    'Accessing mainframe...'
  ],
  currentPhrase: 0,
  charIndex: 0,
  isDeleting: false,
  typeSpeed: 60,
  deleteSpeed: 30,
  pauseEnd: 2000,
  pauseStart: 500,

  init() {
    this.type();
  },

  type() {
    const phrase = this.phrases[this.currentPhrase];

    if (!this.isDeleting) {
      this.el.textContent = phrase.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === phrase.length) {
        this.isDeleting = true;
        setTimeout(() => this.type(), this.pauseEnd);
        return;
      }
      setTimeout(() => this.type(), this.typeSpeed + Math.random() * 40);
    } else {
      this.el.textContent = phrase.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
        setTimeout(() => this.type(), this.pauseStart);
        return;
      }
      setTimeout(() => this.type(), this.deleteSpeed);
    }
  }
};

const HexGrid = {
  canvas: document.getElementById('hexGrid'),
  ctx: null,
  hexes: [],
  time: 0,

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createHexes();
    window.addEventListener('resize', () => {
      this.resize();
      this.createHexes();
    });
    this.animate();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  createHexes() {
    this.hexes = [];
    const size = 25;
    const w = size * 2;
    const h = Math.sqrt(3) * size;
    for (let row = -1; row < this.canvas.height / h + 1; row++) {
      for (let col = -1; col < this.canvas.width / (w * 0.75) + 1; col++) {
        const x = col * w * 0.75;
        const y = row * h + (col % 2 === 0 ? 0 : h / 2);
        this.hexes.push({
          x, y, size,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 1.5,
          active: Math.random() > 0.85
        });
      }
    }
  },

  drawHex(x, y, size, alpha) {
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(hx, hy);
      else this.ctx.lineTo(hx, hy);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    if (alpha > 0.3) {
      this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.1})`;
      this.ctx.fill();
    }
  },

  animate() {
    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.hexes.forEach(hex => {
      const pulse = Math.sin(this.time * hex.pulseSpeed + hex.pulsePhase);
      let alpha = hex.active ? 0.3 + pulse * 0.15 : 0.05 + pulse * 0.03;
      alpha = Math.max(0.02, Math.min(0.6, alpha));
      this.drawHex(hex.x, hex.y, hex.size, alpha);
    });

    requestAnimationFrame(() => this.animate());
  }
};

const Terminal = {
  output: document.getElementById('terminalOutput'),
  input: document.getElementById('terminalInput'),
  body: document.getElementById('terminalBody'),
  commandHistory: [],
  historyIndex: -1,
  isProcessing: false,

  commands: {
    help: {
      output: [
        'Available commands:',
        '  help          - Show this help message',
        '  status        - Display system status',
        '  scan <target> - Scan a target for vulnerabilities',
        '  hack <target> - Attempt to breach target system',
        '  decrypt <key> - Decrypt intercepted data',
        '  ping <host>   - Ping a remote host',
        '  whoami        - Display current user info',
        '  ls            - List directory contents',
        '  cat <file>    - Read file contents',
        '  ifconfig      - Display network interfaces',
        '  ps            - Show running processes',
        '  clear         - Clear terminal output',
        '  exit          - Terminate session'
      ]
    },
    whoami: {
      output: [
        'USER: root (uid=0 gid=0)',
        'GROUP: wheel,operators,netadmin',
        'SHELL: /bin/nxbash',
        'SESSION: encrypted (AES-256-GCM)',
        'PRIVILEGE: SUPERUSER // ALL ACCESS'
      ],
      type: 'success'
    },
    ls: {
      output: [
        'drwxr-xr-x  4 root wheel  4096 Jan 15 02:33 .',
        'drwxr-xr-x  3 root wheel  4096 Jan 15 02:33 ..',
        '-rw-------  1 root wheel   512 Jan 15 02:33 .shadow',
        '-rwxr-xr-x  1 root wheel  8192 Jan 15 02:33 breach_engine',
        '-rw-r--r--  1 root wheel  2048 Jan 15 02:33 config.yaml',
        'drwxr-xr-x  2 root wheel  4096 Jan 15 02:33 exploits/',
        '-rw-r--r--  1 root wheel  4096 Jan 15 02:33 keylog.dat',
        '-rwxr-xr-x  1 root wheel 16384 Jan 15 02:33 nexus_core',
        '-rw-r--r--  1 root wheel  1024 Jan 15 02:33 targets.list'
      ]
    },
    ifconfig: {
      output: [
        'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>',
        '      inet 10.0.13.37  netmask 255.255.0.0',
        '      inet6 fe80::a00:27ff:fe4e:668a  prefixlen 64',
        '      ether 08:00:27:4e:66:8a  txqueuelen 1000',
        '      RX packets 948273  bytes 1.2GB',
        '      TX packets 614432  bytes 847MB',
        '',
        'tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>',
        '      inet 172.16.0.1  netmask 255.255.255.0',
        '      VPN ENCRYPTED // PROXY CHAIN: 3 HOPS'
      ]
    },
    ps: {
      output: [
        '  PID TTY      TIME CMD',
        '    1 ?    00:00:02 systemd',
        '  417 ?    00:00:01 sshd: root@pts/0',
        '  512 ?    00:01:23 nexus_core --daemon',
        '  633 ?    00:00:44 packet_sniffer -i eth0',
        '  741 ?    00:00:12 crypto_engine --aes256',
        '  855 ?    00:00:08 proxy_chain -hops 3',
        '  922 ?    00:00:33 firewall_bypass --stealth',
        ' 1024 pts/0  00:00:00 nxbash',
        ' 1102 pts/0  00:00:00 ps'
      ]
    },
    status: {
      output: null,
      dynamic: true
    },
    clear: {
      action: 'clear'
    },
    exit: {
      output: ['Connection terminated.'], type: 'warning',
      action: 'exit'
    }
  },

  init() {
    this.input.addEventListener('keydown', (e) => this.handleKey(e));
    this.input.addEventListener('focus', () => {
      const cursor = document.getElementById('termCursor');
      if (cursor) cursor.style.display = 'inline';
    });
  },

  handleKey(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      if (cmd) {
        this.commandHistory.unshift(cmd);
        this.historyIndex = -1;
        this.addLine(`root@nexus:~# ${cmd}`, 'term-command');
        this.processCommand(cmd);
      }
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.input.value = this.commandHistory[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.input.value = '';
      }
    }
  },

  addLine(text, className) {
    const line = document.createElement('div');
    line.className = 'term-line' + (className ? ' ' + className : '');
    line.textContent = text;
    this.output.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  },

  addLines(lines, className) {
    lines.forEach((line, i) => {
      setTimeout(() => {
        this.addLine(line, className);
      }, i * 50);
    });
  },

  processCommand(cmd) {
    if (this.isProcessing) return;
    const parts = cmd.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[base]) {
      const command = this.commands[base];

      if (command.action === 'clear') {
        this.output.innerHTML = '';
        return;
      }

      if (command.action === 'exit') {
        this.addLines(command.output, 'term-' + (command.type || 'system'));
        setTimeout(() => {
          this.addLine('', 'term-empty');
          this.addLine('Reconnecting...', 'term-warning');
          setTimeout(() => {
            this.addLine('Connection re-established. Welcome back, operator.', 'term-success');
            this.addLine('', 'term-empty');
          }, 1500);
        }, 500);
        return;
      }

      if (command.dynamic) {
        this.handleDynamicCommand(base, args);
        return;
      }

      this.addLines(command.output, 'term-' + (command.type || 'system'));
    } else if (base === 'scan') {
      this.handleScan(args);
    } else if (base === 'hack') {
      this.handleHack(args);
    } else if (base === 'decrypt') {
      this.handleDecrypt(args);
    } else if (base === 'ping') {
      this.handlePing(args);
    } else if (base === 'cat') {
      this.handleCat(args);
    } else {
      this.addLine(`nxbash: ${base}: command not found`, 'term-error');
    }
  },

  handleDynamicCommand(base) {
    if (base === 'status') {
      const cpuLoad = (60 + Math.random() * 25).toFixed(1);
      const memUsed = (18 + Math.random() * 8).toFixed(1);
      const uptime = UptimeCounter.getUptime();
      const lines = [
        '╔══════════════════════════════════════╗',
        '║      NEXUS BREACH SYSTEM STATUS      ║',
        '╠══════════════════════════════════════╣',
        `║  CPU:    ${cpuLoad}%                     ║`,
        `║  MEMORY: ${memUsed} / 32 GB               ║`,
        `║  UPTIME: ${uptime}                    ║`,
        '║  LINK:   ENCRYPTED                   ║',
        '║  PROXY:  3 CHAINS ACTIVE             ║',
        '╚══════════════════════════════════════╝'
      ];
      this.addLines(lines, 'term-success');
    }
  },

  handleScan(args) {
    const target = args[0] || '192.168.1.0/24';
    this.isProcessing = true;
    this.addLine(`Scanning ${target}...`, 'term-info');

    const scanLines = [
      `[*] Initiating ARP scan on ${target}`,
      '[*] Discovering hosts...',
      `[+] Host 10.0.13.37 is up (0.0023s latency)`,
      `[+] Host 10.0.13.101 is up (0.0041s latency)`,
      `[+] Host 10.0.13.156 is up (0.0019s latency)`,
      '[*] Scanning ports...',
      '[+] 10.0.13.37  -  tcp/22   OPEN   ssh',
      '[+] 10.0.13.37  -  tcp/80   OPEN   http',
      '[+] 10.0.13.37  -  tcp/443  OPEN   https',
      '[+] 10.0.13.101 -  tcp/3306 OPEN   mysql',
      '[+] 10.0.13.156 -  tcp/21   OPEN   ftp',
      '[+] 10.0.13.156 -  tcp/23   OPEN   telnet',
      '[!] VULNERABILITY: 10.0.13.156 telnet default credentials',
      '[!] VULNERABILITY: 10.0.13.101 mysql weak auth',
      '[*] Scan complete. 3 hosts, 6 open ports, 2 vulnerabilities.'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < scanLines.length) {
        const lineType = scanLines[i].startsWith('[!]') ? 'term-error' :
                         scanLines[i].startsWith('[+]') ? 'term-success' : 'term-info';
        this.addLine(scanLines[i], lineType);
        i++;
      } else {
        clearInterval(interval);
        this.isProcessing = false;
      }
    }, 150);
  },

  handleHack(args) {
    const target = args[0] || '10.0.13.156';
    this.isProcessing = true;
    this.addLine(`Initiating breach sequence on ${target}...`, 'term-warning');

    const phases = [
      { text: '[PHASE 1] Enumerating attack vectors...', type: 'term-info', delay: 300 },
      { text: `[PHASE 1] Found 4 exploitable services on ${target}`, type: 'term-success', delay: 800 },
      { text: '[PHASE 2] Injecting payload via telnet backdoor...', type: 'term-info', delay: 500 },
      { text: '[PHASE 2] Authentication bypassed (default:admin/admin)', type: 'term-warning', delay: 1000 },
      { text: '[PHASE 3] Escalating privileges...', type: 'term-info', delay: 400 },
      { text: '[PHASE 3] Root shell obtained via kernel exploit CVE-2024-1337', type: 'term-success', delay: 1200 },
      { text: '[PHASE 4] Establishing persistent backdoor...', type: 'term-info', delay: 600 },
      { text: '[PHASE 4] C2 channel active on port 4444', type: 'term-success', delay: 800 },
      { text: '', type: '', delay: 200 },
      { text: '████████████████████████████████████████ 100%', type: 'term-success', delay: 300 },
      { text: '', type: '', delay: 200 },
      { text: `[BREACH SUCCESSFUL] ${target} is now under operator control`, type: 'term-success', delay: 100 }
    ];

    let totalDelay = 0;
    phases.forEach(phase => {
      totalDelay += phase.delay;
      setTimeout(() => {
        this.addLine(phase.text, phase.type);
        if (phase === phases[phases.length - 1]) {
          this.isProcessing = false;
          Dashboard.incrementBreaches();
        }
      }, totalDelay);
    });
  },

  handleDecrypt(args) {
    const key = args[0] || 'default';
    this.isProcessing = true;
    this.addLine(`Decrypting with key: ${key}`, 'term-info');

    const steps = [
      { text: '[*] Loading ciphertext from buffer...', type: 'term-info', delay: 400 },
      { text: `[*] Applying key: ${key}`, type: 'term-info', delay: 600 },
      { text: '[*] Running AES-256-GCM decryption...', type: 'term-info', delay: 800 },
      { text: '[*] Verifying integrity tag...', type: 'term-info', delay: 500 },
      { text: '[+] Decryption successful', type: 'term-success', delay: 400 },
      { text: '[+] Plaintext: "The access code is N3XUS-0V3RR1D3"', type: 'term-success', delay: 300 }
    ];

    let totalDelay = 0;
    steps.forEach(step => {
      totalDelay += step.delay;
      setTimeout(() => {
        this.addLine(step.text, step.type);
        if (step === steps[steps.length - 1]) {
          this.isProcessing = false;
        }
      }, totalDelay);
    });
  },

  handlePing(args) {
    const host = args[0] || '8.8.8.8';
    this.isProcessing = true;
    this.addLine(`PING ${host} 56(84) bytes of data.`, 'term-info');

    let count = 0;
    const maxPings = 4;
    const interval = setInterval(() => {
      if (count < maxPings) {
        const time = (Math.random() * 20 + 5).toFixed(2);
        this.addLine(`64 bytes from ${host}: icmp_seq=${count + 1} ttl=64 time=${time} ms`, 'term-success');
        count++;
      } else {
        clearInterval(interval);
        this.addLine(`\n--- ${host} ping statistics ---`, 'term-info');
        this.addLine(`${maxPings} packets transmitted, ${maxPings} received, 0% packet loss`, 'term-success');
        this.isProcessing = false;
      }
    }, 600);
  },

  handleCat(args) {
    const file = args[0];
    if (!file) {
      this.addLine('cat: missing file operand', 'term-error');
      return;
    }

    const files = {
      'config.yaml': [
        '---',
        'nexus:',
        '  version: 4.7.2',
        '  encryption: AES-256-GCM',
        '  proxy_chains: 3',
        '  stealth_mode: true',
        '  auto_wipe: true',
        'targets:',
        '  - 10.0.13.0/24',
        '  - 172.16.0.0/16',
        'logging:',
        '  enabled: false',
        '  no_logs_retained: true'
      ],
      'targets.list': [
        '10.0.13.37    # PRIMARY GATEWAY',
        '10.0.13.101   # DATABASE SERVER',
        '10.0.13.156   # LEGACY TELNET',
        '172.16.0.50   # ICS CONTROLLER',
        '172.16.0.99   # SCADA SYSTEM',
        '192.168.1.1   # ROUTER BACKDOOR'
      ],
      '.shadow': [
        '$6$rounds=65536$salTXB3f$Kj8h2Z...',
        '# shadow file - encrypted passwords',
        '# last modified: 2024-01-15'
      ],
      'keylog.dat': [
        '[2024-01-15 02:33:11] KEY: a3f2b8c1d4e5...',
        '[2024-01-15 02:33:14] KEY: 7e9d0c3b2a1f...',
        '[2024-01-15 02:33:19] KEY: 4d6c8b9a0e2f...',
        '[2024-01-15 02:33:22] IV:  f1e2d3c4b5a6...',
        '[2024-01-15 02:33:27] KEY: 9a8b7c6d5e4f...',
        '# 847 keys captured this session'
      ]
    };

    if (files[file]) {
      this.addLines(files[file], 'term-success');
    } else {
      this.addLine(`cat: ${file}: No such file or directory`, 'term-error');
    }
  }
};

const DataStreams = {
  alphaEl: document.getElementById('streamAlpha'),
  bravoEl: document.getElementById('streamBravo'),
  charlieEl: document.getElementById('streamCharlie'),
  hexChars: '0123456789abcdef',
  bufferAlpha: '',
  bufferBravo: '',
  bufferCharlie: '',

  init() {
    this.bufferAlpha = this.generateHex(480);
    this.bufferBravo = this.generateHex(480);
    this.bufferCharlie = this.generateHex(480);

    setInterval(() => this.update(), 80);
  },

  generateHex(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.hexChars[Math.floor(Math.random() * this.hexChars.length)];
      if ((i + 1) % 2 === 0 && i < length - 1) result += ' ';
    }
    return result;
  },

  update() {
    const newChunk = this.generateHex(24).trim();
    this.bufferAlpha = this.bufferAlpha.substring(24) + ' ' + newChunk;
    this.bufferBravo = this.bufferBravo.substring(30) + ' ' + this.generateHex(30).trim();
    this.bufferCharlie = this.bufferCharlie.substring(20) + ' ' + this.generateHex(20).trim();

    if (this.alphaEl) this.alphaEl.textContent = this.bufferAlpha;
    if (this.bravoEl) this.bravoEl.textContent = this.bufferBravo;
    if (this.charlieEl) this.charlieEl.textContent = this.bufferCharlie;
  }
};

const WaveVisualizer = {
  canvas: document.getElementById('waveCanvas'),
  ctx: null,
  time: 0,
  waves: [
    { amplitude: 30, frequency: 0.02, speed: 0.03, color: 'rgba(0, 255, 65, 0.6)', lineWidth: 2 },
    { amplitude: 20, frequency: 0.03, speed: 0.02, color: 'rgba(0, 255, 65, 0.3)', lineWidth: 1.5 },
    { amplitude: 15, frequency: 0.05, speed: 0.04, color: 'rgba(0, 229, 255, 0.4)', lineWidth: 1.5 },
    { amplitude: 25, frequency: 0.015, speed: 0.025, color: 'rgba(0, 229, 255, 0.2)', lineWidth: 1 },
    { amplitude: 10, frequency: 0.07, speed: 0.05, color: 'rgba(255, 0, 60, 0.3)', lineWidth: 1 }
  ],

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  animate() {
    this.time += 1;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.waves.forEach(wave => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = wave.color;
      this.ctx.lineWidth = wave.lineWidth;

      for (let x = 0; x < this.canvas.width; x++) {
        const y = this.canvas.height / 2 +
          Math.sin(x * wave.frequency + this.time * wave.speed) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.5 + this.time * wave.speed * 1.3) * wave.amplitude * 0.5;

        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    });

    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }
    for (let y = 0; y < this.canvas.height; y += 20) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }
    this.ctx.stroke();

    requestAnimationFrame(() => this.animate());
  }
};

const Dashboard = {
  initialized: false,
  breachTotal: 142,
  breachActive: 7,
  packetsCaptured: 948273,
  keysCracked: 2841,
  cpuBase: 65,
  memBase: 55,
  netBase: 35,
  encBase: 95,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    setTimeout(() => {
      this.animateBars();
      this.animateCounters();
      this.startFluctuations();
    }, 500);
  },

  animateBars() {
    const bars = document.querySelectorAll('.dash-bar-fill');
    bars.forEach(bar => {
      const target = parseInt(bar.dataset.target);
      setTimeout(() => {
        bar.style.width = target + '%';
      }, 200);
    });
  },

  animateCounters() {
    this.animateValue('breachTotal', 0, this.breachTotal, 2000);
    this.animateValue('breachActive', 0, this.breachActive, 1500);
    this.animateValue('breachPackets', 0, this.packetsCaptured, 2500, true);
    this.animateValue('breachCracked', 0, this.keysCracked, 2000);

    setTimeout(() => {
      document.getElementById('cpuValue').textContent = this.cpuBase + '%';
      document.getElementById('memValue').textContent = this.memBase + '%';
      document.getElementById('netValue').textContent = '3.2 GB/s';
      document.getElementById('encValue').textContent = this.encBase + '%';
    }, 800);
  },

  animateValue(id, start, end, duration, format) {
    const el = document.getElementById(id);
    if (!el) return;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);

      if (format) {
        el.textContent = current.toLocaleString();
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  },

  startFluctuations() {
    setInterval(() => {
      const cpuFlux = this.cpuBase + Math.floor(Math.random() * 10 - 5);
      const memFlux = this.memBase + Math.floor(Math.random() * 6 - 3);
      const netFlux = (3.0 + Math.random() * 0.8).toFixed(1);

      document.getElementById('cpuValue').textContent = cpuFlux + '%';
      document.getElementById('memValue').textContent = memFlux + '%';
      document.getElementById('netValue').textContent = netFlux + ' GB/s';

      const cpuBar = document.getElementById('cpuBar');
      const memBar = document.getElementById('memBar');
      const netBar = document.getElementById('netBar');
      if (cpuBar) cpuBar.style.width = cpuFlux + '%';
      if (memBar) memBar.style.width = memFlux + '%';
      if (netBar) netBar.style.width = (cpuFlux * 0.6) + '%';
    }, 3000);

    setInterval(() => {
      this.packetsCaptured += Math.floor(Math.random() * 50 + 10);
      const el = document.getElementById('breachPackets');
      if (el) el.textContent = this.packetsCaptured.toLocaleString();
    }, 2000);
  },

  incrementBreaches() {
    this.breachTotal++;
    this.breachActive++;
    const totalEl = document.getElementById('breachTotal');
    const activeEl = document.getElementById('breachActive');
    if (totalEl) totalEl.textContent = this.breachTotal;
    if (activeEl) activeEl.textContent = this.breachActive;
  }
};

const UptimeCounter = {
  startTime: Date.now(),

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const elapsed = Date.now() - this.startTime;
    const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    const uptimeEl = document.getElementById('uptimeValue');
    if (uptimeEl) uptimeEl.textContent = `${hours}:${minutes}:${seconds}`;
  },

  getUptime() {
    const elapsed = Date.now() - this.startTime;
    const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
};

const NetworkTopology = {
  canvas: document.getElementById('networkCanvas'),
  ctx: null,
  nodes: [],
  connections: [],
  time: 0,
  packets: [],

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createNetwork();
    window.addEventListener('resize', () => {
      this.resize();
      this.createNetwork();
    });
    this.animate();
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  createNetwork() {
    this.nodes = [];
    this.connections = [];
    this.packets = [];

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.nodes.push({
      x: centerX, y: centerY, radius: 8,
      type: 'self', label: 'SELF', pulsePhase: 0
    });

    const compromisedCount = 4;
    const activeCount = 5;
    const unknownCount = 8;
    const totalNodes = compromisedCount + activeCount + unknownCount;
    const minDist = 60;

    for (let i = 0; i < totalNodes; i++) {
      let x, y, valid;
      let attempts = 0;
      do {
        x = 50 + Math.random() * (this.canvas.width - 100);
        y = 50 + Math.random() * (this.canvas.height - 100);
        valid = true;
        for (const node of this.nodes) {
          const dx = x - node.x;
          const dy = y - node.y;
          if (Math.sqrt(dx * dx + dy * dy) < minDist) {
            valid = false;
            break;
          }
        }
        attempts++;
      } while (!valid && attempts < 50);

      let type, radius;
      if (i < compromisedCount) {
        type = 'compromised';
        radius = 6;
      } else if (i < compromisedCount + activeCount) {
        type = 'active';
        radius = 5;
      } else {
        type = 'unknown';
        radius = 4;
      }

      this.nodes.push({
        x, y, radius, type,
        label: '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0'),
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 1; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      let nearestDist = Infinity;
      let nearestIdx = 0;
      for (let j = 0; j < this.nodes.length; j++) {
        if (i === j) continue;
        const dx = node.x - this.nodes[j].x;
        const dy = node.y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = j;
        }
      }
      this.connections.push([nearestIdx, i]);
    }

    for (let i = 1; i < this.nodes.length; i++) {
      if (Math.random() > 0.5) {
        const target = Math.floor(Math.random() * this.nodes.length);
        if (target !== i) {
          const exists = this.connections.some(c =>
            (c[0] === i && c[1] === target) || (c[1] === i && c[0] === target)
          );
          if (!exists) {
            this.connections.push([i, target]);
          }
        }
      }
    }

    this.schedulePackets();
  },

  schedulePackets() {
    setInterval(() => {
      if (this.connections.length === 0) return;
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      const reverse = Math.random() > 0.5;
      this.packets.push({
        from: reverse ? conn[1] : conn[0],
        to: reverse ? conn[0] : conn[1],
        progress: 0,
        speed: 0.01 + Math.random() * 0.02
      });
    }, 500);
  },

  animate() {
    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.connections.forEach(([a, b]) => {
      const nodeA = this.nodes[a];
      const nodeB = this.nodes[b];
      this.ctx.beginPath();
      this.ctx.moveTo(nodeA.x, nodeA.y);
      this.ctx.lineTo(nodeB.x, nodeB.y);
      this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });

    this.packets = this.packets.filter(p => p.progress <= 1);
    this.packets.forEach(p => {
      const from = this.nodes[p.from];
      const to = this.nodes[p.to];
      const x = from.x + (to.x - from.x) * p.progress;
      const y = from.y + (to.y - from.y) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00ff41';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#00ff41';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      p.progress += p.speed;
    });

    this.nodes.forEach((node, i) => {
      const pulse = Math.sin(this.time * 2 + node.pulsePhase);
      let color, glowColor;
      switch (node.type) {
        case 'self':
          color = '#00ff41';
          glowColor = 'rgba(0, 255, 65, 0.6)';
          break;
        case 'compromised':
          color = '#ff003c';
          glowColor = 'rgba(255, 0, 60, 0.5)';
          break;
        case 'active':
          color = '#00e5ff';
          glowColor = 'rgba(0, 229, 255, 0.5)';
          break;
        default:
          color = '#555555';
          glowColor = 'rgba(85, 85, 85, 0.3)';
      }

      const r = node.radius + (node.type === 'self' ? pulse * 2 : pulse);
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, Math.max(1, r), 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = node.type === 'self' ? 15 : 8;
      this.ctx.shadowColor = glowColor;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (node.type === 'self') {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, Math.max(1, r + 6 + pulse * 2), 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

      if (node.type !== 'unknown' || i < 5) {
        this.ctx.font = '9px "Share Tech Mono", monospace';
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      }
    });

    requestAnimationFrame(() => this.animate());
  }
};

const GlitchEffect = {
  overlay: document.getElementById('glitchOverlay'),
  mainContent: document.getElementById('mainContent'),

  init() {
    this.scheduleGlitch();
  },

  scheduleGlitch() {
    const delay = 5000 + Math.random() * 15000;
    setTimeout(() => {
      this.triggerGlitch();
      this.scheduleGlitch();
    }, delay);
  },

  triggerGlitch() {
    if (!this.mainContent) return;

    const intensity = Math.random();
    if (intensity > 0.7) {
      this.heavyGlitch();
    } else {
      this.lightGlitch();
    }
  },

  lightGlitch() {
    this.mainContent.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
    this.mainContent.style.filter = 'hue-rotate(5deg)';
    setTimeout(() => {
      this.mainContent.style.transform = `translateX(${(Math.random() - 0.5) * -2}px)`;
      this.mainContent.style.filter = 'hue-rotate(-3deg)';
      setTimeout(() => {
        this.mainContent.style.transform = '';
        this.mainContent.style.filter = '';
      }, 50);
    }, 50);
  },

  heavyGlitch() {
    const offset1 = (Math.random() - 0.5) * 10;
    const offset2 = (Math.random() - 0.5) * 8;
    this.mainContent.style.transform = `translateX(${offset1}px) skewX(${offset2 * 0.5}deg)`;
    this.mainContent.style.filter = 'hue-rotate(15deg) saturate(2)';
    this.overlay.style.opacity = '0.1';
    this.overlay.style.background = `linear-gradient(${Math.random() * 360}deg, 
      rgba(0, 255, 65, 0.05) 0%, transparent 30%, rgba(255, 0, 60, 0.05) 50%, transparent 70%, rgba(0, 229, 255, 0.05) 100%)`;

    setTimeout(() => {
      this.mainContent.style.transform = `translateX(${offset2}px)`;
      this.mainContent.style.filter = 'hue-rotate(-10deg)';
      setTimeout(() => {
        this.mainContent.style.transform = '';
        this.mainContent.style.filter = '';
        this.overlay.style.opacity = '0';
      }, 80);
    }, 80);
  }
};

const ScrollReveal = {
  init() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.id === 'dashboard') {
            Dashboard.init();
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(section);
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.style.opacity = '1';
      heroSection.style.transform = 'none';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.revealed').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  const style = document.createElement('style');
  style.textContent = `
    section.revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});

const FooterClock = {
  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const el = document.getElementById('footerClock');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }
};

const SessionManager = {
  init() {
    const id = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    const el = document.getElementById('sessionId');
    if (el) el.textContent = '0x' + id;
  }
};

const ProtocolHandler = {
  init() {
    document.querySelectorAll('.protocol-btn:not(.protocol-btn-locked)').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.protocol-card');
        if (!card || card.dataset.status === 'executing' || card.dataset.status === 'complete') return;

        const name = card.querySelector('.protocol-name').textContent;
        const statusEl = card.querySelector('.protocol-status');

        card.dataset.status = 'executing';
        statusEl.textContent = 'EXECUTING';
        statusEl.className = 'protocol-status protocol-status-armed';
        btn.textContent = 'RUNNING...';
        btn.disabled = true;

        const duration = 2000 + Math.random() * 3000;
        setTimeout(() => {
          card.dataset.status = 'complete';
          statusEl.textContent = 'COMPLETE';
          statusEl.className = 'protocol-status';
          btn.textContent = 'COMPLETE';
          btn.style.borderColor = 'var(--lime)';
          btn.style.color = 'var(--lime)';

          Dashboard.incrementBreaches();

          const keysCrackedEl = document.getElementById('breachCracked');
          if (keysCrackedEl) {
            const current = parseInt(keysCrackedEl.textContent.replace(/,/g, '')) || 0;
            keysCrackedEl.textContent = (current + Math.floor(Math.random() * 50 + 10)).toLocaleString();
          }

          setTimeout(() => {
            card.dataset.status = 'ready';
            statusEl.textContent = 'READY';
            statusEl.className = 'protocol-status';
            btn.textContent = 'EXECUTE';
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 5000);
        }, duration);
      });
    });
  }
};

const HeroActions = {
  init() {
    const breachBtn = document.getElementById('btnBreach');
    const scanBtn = document.getElementById('btnScan');

    if (breachBtn) {
      breachBtn.addEventListener('click', () => {
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
          terminalSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            Terminal.input.value = 'hack 10.0.13.156';
            Terminal.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            Terminal.input.value = '';
          }, 800);
        }
      });
    }

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        const networkSection = document.getElementById('network');
        if (networkSection) {
          networkSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
};

const App = {
  init() {
    CodeRain.init();
    BootSequence.init();
    Terminal.init();
    DataStreams.init();
    UptimeCounter.init();
    FooterClock.init();
    SessionManager.init();
    ProtocolHandler.init();
    HeroActions.init();
  }
};

document.addEventListener('DOMContentLoaded', App.init);
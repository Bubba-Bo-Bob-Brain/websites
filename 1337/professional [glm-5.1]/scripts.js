const BootSequence = {
  element: null,
  textElement: null,
  lines: [
    'BIOS v4.7.2 — Shellshock Systems Inc.',
    'Initializing hardware... OK',
    'CPU: AMD EPYC 9654 96-Core Processor',
    'RAM: 512GB DDR5 @ 4800MHz........... OK',
    'NIC: Intel E810-CQDA2 100GbE....... OK',
    'Storage: NVMe RAID-0 4x2TB......... OK',
    '',
    'Loading kernel: vmlinuz-6.1.0-shellshock',
    'Init: systemd[1] starting...',
    '  [  OK  ] Started Security Monitor Daemon',
    '  [  OK  ] Started Threat Intelligence Feed',
    '  [  OK  ] Started Network Intrusion Detection',
    '  [  OK  ] Started Cryptographic Services',
    '  [  OK  ] Started Audit Logging System',
    '',
    'Establishing encrypted tunnel... OK',
    'TLS 1.3 — AES-256-GCM — SHA-384',
    'Identity verified: root@shellshock',
    'Clearance level: TOP SECRET / SCI',
    '',
    'SHELLSHOCK SECURITY SYSTEMS v4.7.2',
    '===================================',
    'All systems operational.',
    'Welcome, operator.',
    '',
    'login: _'
  ],

  init() {
    this.element = document.getElementById('boot-sequence');
    this.textElement = document.getElementById('boot-text');
    if (!this.element || !this.textElement) return;
    this.run();
  },

  async run() {
    for (let i = 0; i < this.lines.length; i++) {
      await this.typeLine(this.lines[i]);
      if (i < this.lines.length - 1) {
        this.textElement.textContent += '\n';
      }
      await this.delay(40 + Math.random() * 60);
    }
    await this.delay(600);
    this.element.classList.add('hidden');
    await this.delay(500);
    this.element.style.display = 'none';
  },

  async typeLine(line) {
    for (let i = 0; i < line.length; i++) {
      this.textElement.textContent += line[i];
      await this.delay(8 + Math.random() * 12);
    }
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

const MatrixRain = {
  canvas: null,
  ctx: null,
  columns: [],
  fontSize: 14,
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:<>?/~',

  init() {
    this.canvas = document.getElementById('matrix-rain');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createColumns();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createColumns();
  },

  createColumns() {
    const columnCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = [];
    for (let i = 0; i < columnCount; i++) {
      this.columns[i] = Math.random() * this.canvas.height / this.fontSize;
    }
  },

  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = this.fontSize + 'px monospace';

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      this.ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      this.ctx.fillText(char, x, y);
      this.ctx.globalAlpha = 1;

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }

    requestAnimationFrame(() => this.animate());
  }
};

const HeroTyping = {
  target: null,
  phrases: [
    'scan --deep --all-ports 10.0.0.0/8',
    'nmap -sS -sV -O --script=vuln target',
    'hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt',
    'msfconsole -x "use exploit/multi/handler"',
    'airmon-ng start wlan0',
    'gobuster dir -u target -w /usr/share/wordlists/dirb/big.txt',
    'sqlmap -u "target?id=1" --dbs --batch',
    'volatility -f memory.dmp --profile=Win10 pslist'
  ],
  currentPhrase: 0,
  currentChar: 0,
  isDeleting: false,

  init() {
    this.target = document.querySelector('.hero-typing');
    if (!this.target) return;
    this.type();
  },

  async type() {
    const phrase = this.phrases[this.currentPhrase];

    if (!this.isDeleting) {
      this.currentChar++;
      this.target.textContent = phrase.substring(0, this.currentChar);

      if (this.currentChar === phrase.length) {
        await this.delay(2000);
        this.isDeleting = true;
      }
    } else {
      this.currentChar--;
      this.target.textContent = phrase.substring(0, this.currentChar);

      if (this.currentChar === 0) {
        this.isDeleting = false;
        this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
        await this.delay(500);
      }
    }

    const speed = this.isDeleting ? 25 : 50 + Math.random() * 50;
    setTimeout(() => this.type(), speed);
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  }
};

const GlitchEffect = {
  init() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    glitchElements.forEach(el => {
      setInterval(() => {
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 200 + Math.random() * 300);
      }, 3000 + Math.random() * 5000);
    });

    this.scrambleEffect();
  },

  scrambleEffect() {
    const titles = document.querySelectorAll('.section-title');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.scramble(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    titles.forEach(title => observer.observe(title));
  },

  scramble(element) {
    const original = element.getAttribute('data-text') || element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:<>?/~0123456789';
    let iteration = 0;

    const interval = setInterval(() => {
      element.textContent = original
        .split('')
        .map((char, index) => {
          if (index < iteration) return original[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration += 1;
      if (iteration > original.length) {
        clearInterval(interval);
        element.textContent = original;
      }
    }, 30);
  }
};

const ThreatFeed = {
  feeds: {
    critical: {
      container: null,
      templates: [
        { title: 'APT29 C2 Beacon Detected', source: '192.168.45.{ip}' },
        { title: 'Zero-Day Exploit Attempt', source: '10.{ip}.0.1' },
        { title: 'Ransomware Payload Deployed', source: '172.16.{ip}.99' },
        { title: 'Kernel Exploit Escalation', source: '203.0.{ip}.50' },
        { title: 'Data Exfiltration Alert', source: '198.51.{ip}.23' },
        { title: 'Supply Chain Compromise', source: '10.{ip}.10.5' }
      ]
    },
    high: {
      container: null,
      templates: [
        { title: 'Brute Force SSH Attempt', source: '45.33.{ip}.1' },
        { title: 'SQL Injection Attack', source: '185.{ip}.20.4' },
        { title: 'Suspicious PowerShell', source: '10.{ip}.5.10' },
        { title: 'Malware C2 Callback', source: '91.{ip}.42.7' },
        { title: 'Privilege Escalation', source: '172.{ip}.1.50' },
        { title: 'Phishing Kit Deployed', source: '103.{ip}.88.3' }
      ]
    },
    medium: {
      container: null,
      templates: [
        { title: 'Port Scan Detected', source: '10.{ip}.0.1' },
        { title: 'Failed Login x50', source: '192.168.{ip}.1' },
        { title: 'DNS Tunneling Suspect', source: '10.{ip}.1.100' },
        { title: 'Unusual Traffic Pattern', source: '172.16.{ip}.5' },
        { title: 'Config Change Alert', source: '10.{ip}.0.254' },
        { title: 'Certificate Expiry', source: 'internal-ca-{id}' }
      ]
    },
    low: {
      container: null,
      templates: [
        { title: 'New Device Connected', source: 'MAC:{mac}' },
        { title: 'Firewall Rule Update', source: 'fw-{id}' },
        { title: 'Service Restart', source: 'srv-{id}.local' },
        { title: 'Log Rotation', source: 'syslog-{id}' },
        { title: 'Backup Completed', source: 'bkp-{id}.local' },
        { title: 'Patch Available', source: 'pkg-manager' }
      ]
    }
  },

  init() {
    Object.keys(this.feeds).forEach(severity => {
      this.feeds[severity].container = document.getElementById(severity + '-feed');
    });

    for (let i = 0; i < 3; i++) {
      Object.keys(this.feeds).forEach(severity => {
        this.addThreat(severity);
      });
    }

    setInterval(() => {
      const severities = Object.keys(this.feeds);
      const severity = severities[Math.floor(Math.random() * severities.length)];
      this.addThreat(severity);
    }, 2500 + Math.random() * 2000);
  },

  addThreat(severity) {
    const feed = this.feeds[severity];
    if (!feed.container) return;

    const template = feed.templates[Math.floor(Math.random() * feed.templates.length)];
    const now = new Date();
    const time = now.toTimeString().substring(0, 8);

    const ip = Math.floor(Math.random() * 255);
    const id = Math.floor(Math.random() * 999);
    const macSegments = [];
    for (let i = 0; i < 6; i++) {
      macSegments.push(Math.floor(Math.random() * 255).toString(16).padStart(2, '0'));
    }
    const mac = macSegments.join(':');

    const title = template.title;
    const source = template.source
      .replace('{ip}', ip)
      .replace('{id}', id)
      .replace('{mac}', mac);

    const item = document.createElement('div');
    item.className = 'threat-item';
    item.innerHTML = `
      <div class="threat-item-time">${time}</div>
      <div class="threat-item-title">${title}</div>
      <div class="threat-item-source">SRC: ${source}</div>
    `;

    feed.container.prepend(item);

    while (feed.container.children.length > 20) {
      feed.container.removeChild(feed.container.lastChild);
    }

    const countEl = document.getElementById(severity + '-count');
    if (countEl) {
      const current = parseInt(countEl.textContent, 10);
      countEl.textContent = String(current + 1).padStart(2, '0');
    }
  }
};

const AttackMap = {
  canvas: null,
  ctx: null,
  cities: [],
  attacks: [],
  animationId: null,

  init() {
    this.canvas = document.getElementById('attack-map-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.defineCities();
    this.startAttacks();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  defineCities() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.cities = [
      { name: 'New York', x: w * 0.25, y: h * 0.35 },
      { name: 'London', x: w * 0.45, y: h * 0.28 },
      { name: 'Frankfurt', x: w * 0.50, y: h * 0.30 },
      { name: 'Tokyo', x: w * 0.85, y: h * 0.38 },
      { name: 'Singapore', x: w * 0.76, y: h * 0.58 },
      { name: 'Sydney', x: w * 0.87, y: h * 0.72 },
      { name: 'São Paulo', x: w * 0.30, y: h * 0.68 },
      { name: 'Mumbai', x: w * 0.65, y: h * 0.48 },
      { name: 'Dubai', x: w * 0.58, y: h * 0.42 },
      { name: 'Lagos', x: w * 0.47, y: h * 0.55 },
      { name: 'Moscow', x: w * 0.55, y: h * 0.22 },
      { name: 'Beijing', x: w * 0.78, y: h * 0.32 },
      { name: 'Seoul', x: w * 0.82, y: h * 0.35 },
      { name: 'Los Angeles', x: w * 0.13, y: h * 0.40 },
      { name: 'Toronto', x: w * 0.22, y: h * 0.30 },
      { name: 'Johannesburg', x: w * 0.52, y: h * 0.70 },
      { name: 'Shanghai', x: w * 0.80, y: h * 0.40 },
      { name: 'Jakarta', x: w * 0.74, y: h * 0.60 }
    ];
  },

  startAttacks() {
    setInterval(() => {
      if (this.attacks.length > 8) return;
      const from = this.cities[Math.floor(Math.random() * this.cities.length)];
      const to = this.cities[Math.floor(Math.random() * this.cities.length)];
      if (from === to) return;

      const types = ['ddos', 'intrusion', 'malware', 'phishing'];
      const type = types[Math.floor(Math.random() * types.length)];

      this.attacks.push({
        from, to, type,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01
      });
    }, 800 + Math.random() * 1500);
  },

  animate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);
    this.drawCities(ctx);
    this.drawAttacks(ctx);

    this.attacks = this.attacks.filter(a => a.progress <= 1);
    this.attacks.forEach(a => a.progress += a.speed);

    this.updateStats();

    this.animationId = requestAnimationFrame(() => this.animate());
  },

  drawGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.04)';
    ctx.lineWidth = 0.5;

    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },

  drawCities(ctx) {
    this.cities.forEach(city => {
      ctx.beginPath();
      ctx.arc(city.x, city.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff41';
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '10px "Fira Code", monospace';
      ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
      ctx.fillText(city.name, city.x + 6, city.y + 3);
    });
  },

  drawAttacks(ctx) {
    const colors = {
      ddos: '#ff003c',
      intrusion: '#ffb300',
      malware: '#00e5ff',
      phishing: '#00ff41'
    };

    this.attacks.forEach(attack => {
      const color = colors[attack.type] || '#00ff41';
      const from = attack.from;
      const to = attack.to;
      const progress = attack.progress;

      const midX = (from.x + to.x) / 2;
      const midY = Math.min(from.y, to.y) - 50 - Math.abs(from.x - to.x) * 0.15;

      const t = progress;
      const pointX = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
      const pointY = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(midX, midY, to.x, to.y);
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      const trailLength = 0.05;
      for (let i = 1; i <= 5; i++) {
        const tt = Math.max(0, t - trailLength * i);
        const tx = (1 - tt) * (1 - tt) * from.x + 2 * (1 - tt) * tt * midX + tt * tt * to.x;
        const ty = (1 - tt) * (1 - tt) * from.y + 2 * (1 - tt) * tt * midY + tt * tt * to.y;
        ctx.beginPath();
        ctx.arc(tx, ty, 2 - i * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(80 - i * 15).toString(16).padStart(2, '0');
        ctx.fill();
      }
    });
  },

  updateStats() {
    const attacksEl = document.getElementById('map-attacks');
    const sourcesEl = document.getElementById('map-sources');
    const targetsEl = document.getElementById('map-targets');

    if (attacksEl) attacksEl.textContent = this.attacks.length + Math.floor(Math.random() * 3);
    if (sourcesEl) sourcesEl.textContent = Math.min(this.attacks.length * 2 + 12, 48);
    if (targetsEl) targetsEl.textContent = Math.min(this.attacks.length + 5, 18);
  }
};

const NetworkTopology = {
  canvas: null,
  ctx: null,
  nodes: [],
  edges: [],
  hoveredNode: null,
  mouseX: 0,
  mouseY: 0,
  time: 0,

  init() {
    this.canvas = document.getElementById('topology-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createNetwork();
    this.bindEvents();
    this.animate();
    window.addEventListener('resize', () => {
      this.resize();
      this.repositionNodes();
    });
  },

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  createNetwork() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.nodes = [
      { id: 'firewall', label: 'FIREWALL', type: 'firewall', x: cx, y: cy - 80, status: 'secure', rx: 3, ry: 0 },
      { id: 'dmz-web1', label: 'WEB-SRV-01', type: 'server', x: cx - 120, y: cy + 20, status: 'secure', rx: 2, ry: 0 },
      { id: 'dmz-web2', label: 'WEB-SRV-02', type: 'server', x: cx + 120, y: cy + 20, status: 'warning', rx: 2, ry: 0 },
      { id: 'ids', label: 'IDS/IPS', type: 'security', x: cx, y: cy - 180, status: 'secure', rx: 3, ry: 0 },
      { id: 'db', label: 'DB-PRIMARY', type: 'database', x: cx - 80, y: cy + 120, status: 'secure', rx: 2, ry: 0 },
      { id: 'db-replica', label: 'DB-REPLICA', type: 'database', x: cx + 80, y: cy + 120, status: 'secure', rx: 2, ry: 0 },
      { id: 'app', label: 'APP-SRV', type: 'server', x: cx, y: cy + 60, status: 'secure', rx: 2, ry: 0 },
      { id: 'auth', label: 'AUTH-SRV', type: 'security', x: cx - 180, y: cy - 40, status: 'secure', rx: 2, ry: 0 },
      { id: 'log', label: 'SIEM', type: 'security', x: cx + 180, y: cy - 40, status: 'secure', rx: 2, ry: 0 },
      { id: 'endpoint1', label: 'WORKSTN-01', type: 'endpoint', x: cx - 200, y: cy + 140, status: 'secure', rx: 1, ry: 0 },
      { id: 'endpoint2', label: 'WORKSTN-02', type: 'endpoint', x: cx + 200, y: cy + 140, status: 'critical', rx: 1, ry: 0 },
      { id: 'cloud', label: 'CLOUD-GW', type: 'cloud', x: cx, y: cy - 220, status: 'warning', rx: 2, ry: 0 }
    ];

    this.edges = [
      { from: 'cloud', to: 'ids', active: true },
      { from: 'ids', to: 'firewall', active: true },
      { from: 'firewall', to: 'dmz-web1', active: true },
      { from: 'firewall', to: 'dmz-web2', active: true },
      { from: 'firewall', to: 'app', active: true },
      { from: 'firewall', to: 'auth', active: true },
      { from: 'app', to: 'db', active: true },
      { from: 'db', to: 'db-replica', active: true },
      { from: 'dmz-web1', to: 'app', active: true },
      { from: 'dmz-web2', to: 'app', active: true },
      { from: 'firewall', to: 'log', active: true },
      { from: 'app', to: 'log', active: false },
      { from: 'auth', to: 'db', active: true },
      { from: 'endpoint1', to: 'firewall', active: true },
      { from: 'endpoint2', to: 'firewall', active: true },
      { from: 'log', to: 'cloud', active: false }
    ];
  },

  repositionNodes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scaleX = w / 800;
    const scaleY = h / 450;

    const offsets = [
      [0, -80], [-120, 20], [120, 20], [0, -180],
      [-80, 120], [80, 120], [0, 60], [-180, -40],
      [180, -40], [-200, 140], [200, 140], [0, -220]
    ];

    this.nodes.forEach((node, i) => {
      if (offsets[i]) {
        node.x = cx + offsets[i][0] * scaleX;
        node.y = cy + offsets[i][1] * scaleY;
      }
    });
  },

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.checkHover();
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredNode) {
        this.showNodeDetails(this.hoveredNode);
      }
    });
  },

  checkHover() {
    this.hoveredNode = null;
    for (const node of this.nodes) {
      const dx = this.mouseX - node.x;
      const dy = this.mouseY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < 25) {
        this.hoveredNode = node;
        this.canvas.style.cursor = 'pointer';
        return;
      }
    }
    this.canvas.style.cursor = 'default';
  },

  showNodeDetails(node) {
    const details = document.getElementById('topology-details');
    if (!details) return;

    const statusColors = {
      secure: 'status-secure',
      warning: 'status-warning',
      critical: 'status-critical'
    };

    const ip = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const uptime = Math.floor(Math.random() * 365) + 'd ' + Math.floor(Math.random() * 24) + 'h';
    const connections = this.edges.filter(e => e.from === node.id || e.to === node.id).length;

    details.innerHTML = `
      <div class="info-field">
        <span class="info-field-label">NODE</span>
        <span class="info-field-value">${node.label}</span>
      </div>
      <div class="info-field">
        <span class="info-field-label">TYPE</span>
        <span class="info-field-value">${node.type.toUpperCase()}</span>
      </div>
      <div class="info-field">
        <span class="info-field-label">STATUS</span>
        <span class="info-field-value ${statusColors[node.status]}">${node.status.toUpperCase()}</span>
      </div>
      <div class="info-field">
        <span class="info-field-label">IP ADDRESS</span>
        <span class="info-field-value">${ip}</span>
      </div>
      <div class="info-field">
        <span class="info-field-label">UPTIME</span>
        <span class="info-field-value">${uptime}</span>
      </div>
      <div class="info-field">
        <span class="info-field-label">CONNECTIONS</span>
        <span class="info-field-value">${connections}</span>
      </div>
    `;
  },

  animate() {
    this.time += 0.02;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#0c0c0c';
    ctx.fillRect(0, 0, w, h);

    this.drawGrid(ctx, w, h);
    this.drawEdges(ctx);
    this.drawNodes(ctx);

    requestAnimationFrame(() => this.animate());
  },

  drawGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },

  drawEdges(ctx) {
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isAlertEdge = fromNode.status === 'critical' || toNode.status === 'critical';
      const color = isAlertEdge ? 'rgba(255, 0, 60, 0.6)' : 'rgba(0, 255, 65, 0.2)';
      const glowColor = isAlertEdge ? '#ff003c' : '#00ff41';

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = edge.active ? 1.5 : 0.5;
      ctx.stroke();

      if (edge.active && !isAlertEdge) {
        const t = (this.time * 0.5 + fromNode.x * 0.01) % 1;
        const px = fromNode.x + (toNode.x - fromNode.x) * t;
        const py = fromNode.y + (toNode.y - fromNode.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  },

  drawNodes(ctx) {
    const typeColors = {
      firewall: '#ff003c',
      server: '#00ff41',
      security: '#00e5ff',
      database: '#ffb300',
      endpoint: '#00ff41',
      cloud: '#00e5ff'
    };

    const statusGlows = {
      secure: '#00ff41',
      warning: '#ffb300',
      critical: '#ff003c'
    };

    this.nodes.forEach(node => {
      const isHovered = this.hoveredNode === node;
      const baseColor = typeColors[node.type] || '#00ff41';
      const glowColor = statusGlows[node.status] || '#00ff41';
      const radius = isHovered ? 18 : 14;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0c0c0c';
      ctx.fill();
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.shadowBlur = isHovered ? 15 : 8;
      ctx.shadowColor = glowColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (node.status === 'critical') {
        const pulse = Math.sin(this.time * 3) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 0, 60, ${0.2 + pulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.font = '9px "Fira Code", monospace';
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(0, 255, 65, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 14);
      ctx.textAlign = 'left';
    });
  }
};

const CipherDecoder = {
  shift: 3,

  init() {
    const decBtn = document.getElementById('decrypt-btn');
    const bfBtn = document.getElementById('bruteforce-btn');
    const incBtn = document.getElementById('shift-inc');
    const decBtn2 = document.getElementById('shift-dec');
    const shiftDisplay = document.getElementById('shift-value');

    if (decBtn) decBtn.addEventListener('click', () => this.decrypt());
    if (bfBtn) bfBtn.addEventListener('click', () => this.bruteForce());
    if (incBtn) incBtn.addEventListener('click', () => {
      this.shift = Math.min(25, this.shift + 1);
      if (shiftDisplay) shiftDisplay.textContent = this.shift;
    });
    if (decBtn2) decBtn2.addEventListener('click', () => {
      this.shift = Math.max(1, this.shift - 1);
      if (shiftDisplay) shiftDisplay.textContent = this.shift;
    });
  },

  caesarShift(text, shift) {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      return char;
    }).join('');
  },

  decrypt() {
    const input = document.getElementById('cipher-input');
    const output = document.getElementById('decrypt-output');
    if (!input || !output) return;

    const text = input.value;
    if (!text.trim()) return;

    const result = this.caesarShift(text, this.shift);
    output.innerHTML = '';
    this.revealText(output, result);
  },

  revealText(container, text) {
    const chars = '!@#$%^&*()_+-=<>?/~0123456789';
    let iteration = 0;

    const interval = setInterval(() => {
      container.textContent = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration += 1.5;
      if (iteration > text.length) {
        clearInterval(interval);
        container.textContent = text;
      }
    }, 20);
  },

  bruteForce() {
    const input = document.getElementById('cipher-input');
    const results = document.getElementById('bruteforce-results');
    if (!input || !results) return;

    const text = input.value;
    if (!text.trim()) return;

    results.innerHTML = '';

    for (let shift = 1; shift <= 25; shift++) {
      const decoded = this.caesarShift(text, shift);
      const line = document.createElement('div');
      line.className = 'bruteforce-line' + (shift === this.shift ? ' best-match' : '');
      line.textContent = `[${String(shift).padStart(2, '0')}] ${decoded}`;
      line.addEventListener('click', () => {
        const output = document.getElementById('decrypt-output');
        if (output) {
          this.shift = shift;
          const shiftDisplay = document.getElementById('shift-value');
          if (shiftDisplay) shiftDisplay.textContent = shift;
          output.textContent = decoded;
          results.querySelectorAll('.bruteforce-line').forEach(l => l.classList.remove('best-match'));
          line.classList.add('best-match');
        }
      });
      results.appendChild(line);
    }
  }
};

const AuditLog = {
  container: null,
  lineCount: 0,
  maxLines: 200,
  templates: [
    { level: 'INFO', messages: [
      'Connection established from {ip}',
      'TLS handshake completed with {host}',
      'Session token refreshed for user:{uid}',
      'Firewall rule #{rule} applied successfully',
      'Certificate rotation completed for {host}',
      'Backup snapshot created: snap-{id}',
      'Health check passed: {service}',
      'DNS query resolved: {host} -> {ip}',
      'Log aggregation pipeline running',
      'Rate limiter configured: {limit} req/s'
    ]},
    { level: 'WARN', messages: [
      'Unusual login pattern detected for user:{uid} from {ip}',
      'Certificate expiring in 7 days: {host}',
      'Rate limit threshold approaching: {service}',
      'Memory usage above 85% on {host}',
      'Failed DNS resolution for {host}',
      'Connection pool near capacity: {service}',
      'Retry attempt #{attempt} for {service}',
      'Disk usage at 78% on {host}'
    ]},
    { level: 'ERROR', messages: [
      'Authentication failure from {ip} — account:{uid}',
      'Connection refused: {host}:{port}',
      'TLS certificate validation failed for {host}',
      'Permission denied: {uid}@{host}',
      'Service unavailable: {service} — restarting',
      'Buffer overflow attempt blocked from {ip}',
      'SQL injection pattern detected from {ip}',
      'Port scan detected from {ip} — {count} ports'
    ]},
    { level: 'DEBUG', messages: [
      'Packet inspection: {proto} from {ip}',
      'Cache hit ratio: {ratio}%',
      'Worker thread pool: {count} active',
      'GC cycle completed in {ms}ms',
      'Route table updated: {count} entries',
      'Socket buffer flushed: {host}'
    ]}
  ],

  init() {
    this.container = document.getElementById('audit-log-body');
    if (!this.container) return;

    for (let i = 0; i < 15; i++) {
      this.addLogEntry();
    }

    setInterval(() => this.addLogEntry(), 1500 + Math.random() * 2500);
  },

  addLogEntry() {
    if (!this.container) return;

    const levelGroup = this.templates[Math.floor(Math.random() * this.templates.length)];
    const level = levelGroup.level;
    const messageTemplate = levelGroup.messages[Math.floor(Math.random() * levelGroup.messages.length)];

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const host = `srv-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 99)}.local`;
    const uid = `user_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    const port = [22, 80, 443, 3306, 5432, 8080, 8443, 27017][Math.floor(Math.random() * 8)];
    const service = ['nginx', 'postgres', 'redis', 'vault', 'consul', 'grafana', 'prometheus', 'elasticsearch'][Math.floor(Math.random() * 8)];
    const proto = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH'][Math.floor(Math.random() * 6)];
    const rule = Math.floor(Math.random() * 999);
    const id = Math.floor(Math.random() * 9999);
    const count = Math.floor(Math.random() * 500) + 10;
    const ratio = (Math.random() * 30 + 70).toFixed(1);
    const limit = [100, 500, 1000, 5000][Math.floor(Math.random() * 4)];
    const ms = Math.floor(Math.random() * 100) + 5;
    const attempt = Math.floor(Math.random() * 5) + 1;
    const hash = Math.random().toString(36).substring(2, 10);

    const message = messageTemplate
      .replace('{ip}', ip)
      .replace('{host}', host)
      .replace('{uid}', uid)
      .replace('{port}', String(port))
      .replace('{service}', service)
      .replace('{proto}', proto)
      .replace('{rule}', String(rule))
      .replace('{id}', String(id))
      .replace('{count}', String(count))
      .replace('{ratio}', ratio)
      .replace('{limit}', String(limit))
      .replace('{ms}', String(ms))
      .replace('{attempt}', String(attempt));

    const levelClass = `log-level-${level.toLowerCase()}`;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span><span class="log-level ${levelClass}">${level.padEnd(5)}</span><span class="log-message">${message}</span> <span class="log-hash">${hash}</span>`;

    this.container.appendChild(entry);
    this.lineCount++;

    while (this.container.children.length > this.maxLines) {
      this.container.removeChild(this.container.firstChild);
    }

    this.container.scrollTop = this.container.scrollHeight;

    const countEl = document.getElementById('log-line-count');
    if (countEl) countEl.textContent = this.lineCount;
  }
};

const ScrollReveal = {
  init() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('reveal-section'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
};

const NavHighlight = {
  init() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            link.style.textShadow = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = '#00ff41';
              link.style.textShadow = '0 0 4px rgba(0, 255, 65, 0.3)';
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }
};

const UptimeCounter = {
  startTime: Date.now(),

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');

    const el = document.getElementById('footer-uptime');
    if (el) el.textContent = `${hours}:${minutes}:${seconds}`;
  }
};

const ScanlineEffect = {
  init() {
    const overlay = document.querySelector('.scanline-overlay');
    if (!overlay) return;

    let scanlineY = 0;
    const scanline = document.createElement('div');
    scanline.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgba(0, 255, 65, 0.03);
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(scanline);

    const animateScanline = () => {
      scanlineY += 1;
      if (scanlineY > window.innerHeight) scanlineY = 0;
      scanline.style.top = scanlineY + 'px';
      requestAnimationFrame(animateScanline);
    };
    animateScanline();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  BootSequence.init();

  setTimeout(() => {
    MatrixRain.init();
    HeroTyping.init();
    CounterAnimation.init();
    GlitchEffect.init();
    ThreatFeed.init();
    AttackMap.init();
    NetworkTopology.init();
    CipherDecoder.init();
    AuditLog.init();
    ScrollReveal.init();
    NavHighlight.init();
    UptimeCounter.init();
    ScanlineEffect.init();
  }, 100);
});
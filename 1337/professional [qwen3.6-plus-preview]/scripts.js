/* =========================================
   CIPHERSEC // CYBER INTELLIGENCE TERMINAL
   JAVASCRIPT LOGIC & INTERACTIVITY
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  const state = {
    isLoaded: false,
    feedPaused: false,
    logsPaused: false,
    feedCount: 0,
    activeSection: 'dashboard',
    networkNodes: [],
    mouseX: 0,
    mouseY: 0
  };

  // --- DOM ELEMENTS ---
  const dom = {
    loadingScreen: document.getElementById('loadingScreen'),
    mainContainer: document.querySelector('.main-container'),
    typingText: document.getElementById('typingText'),
    feedList: document.getElementById('feedList'),
    feedCount: document.getElementById('feedCount'),
    logBody: document.getElementById('logBody'),
    networkCanvas: document.getElementById('networkCanvas'),
    nodeDetails: document.getElementById('nodeDetails'),
    nodeList: document.getElementById('nodeList'),
    cursorDot: document.querySelector('.cursor-dot'),
    cursorRing: document.querySelector('.cursor-ring'),
    navLinks: document.querySelectorAll('.nav-link'),
    feedFilters: document.querySelectorAll('.feed-filter'),
    pauseLogsBtn: document.getElementById('pauseLogs'),
    clearLogsBtn: document.getElementById('clearLogs'),
    exportLogsBtn: document.getElementById('exportLogs'),
    uptimeDisplay: document.getElementById('uptime'),
    statValues: document.querySelectorAll('.stat-value')
  };

  // --- UTILITIES ---
  const utils = {
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    randomHex: (length) => Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    randomIP: () => `${utils.randomInt(1, 255)}.${utils.randomInt(0, 255)}.${utils.randomInt(0, 255)}.${utils.randomInt(1, 255)}`,
    randomPort: () => utils.randomInt(1024, 65535),
    formatTime: (date) => date.toTimeString().split(' ')[0],
    lerp: (start, end, t) => start * (1 - t) + end * t
  };

  // --- LOADING SEQUENCE ---
  function initLoadingSequence() {
    const completeLine = document.querySelector('.loading-complete');
    const duration = 2000;
    
    setTimeout(() => {
      completeLine.style.opacity = '1';
      setTimeout(() => {
        dom.loadingScreen.classList.add('hidden');
        dom.mainContainer.classList.add('visible');
        state.isLoaded = true;
        initAllSystems();
      }, 800);
    }, duration);
  }

  // --- CUSTOM CURSOR ---
  function initCustomCursor() {
    // Check if touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      dom.cursorDot.style.display = 'none';
      dom.cursorRing.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      
      dom.cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      
      // Slight delay for ring for fluid feel
      setTimeout(() => {
        dom.cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }, 50);
    });

    // Hover effects for interactive elements
    const interactives = document.querySelectorAll('a, button, .feed-filter, .node-item, .vuln-card, .encrypted-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dom.cursorRing.style.width = '40px';
        dom.cursorRing.style.height = '40px';
        dom.cursorRing.style.borderColor = 'var(--green-primary)';
        dom.cursorRing.style.boxShadow = '0 0 10px var(--green-glow)';
      });
      el.addEventListener('mouseleave', () => {
        dom.cursorRing.style.width = '24px';
        dom.cursorRing.style.height = '24px';
        dom.cursorRing.style.borderColor = 'var(--green-secondary)';
        dom.cursorRing.style.boxShadow = 'none';
      });
    });
  }

  // --- TYPING EFFECT ---
  function initTypingEffect() {
    const commands = [
      'initiate_scan --depth=deep --target=all',
      'decrypt_intel --source=apt28 --key=0x7F3A',
      'monitor_traffic --interface=eth0 --filter=malicious',
      'update_signatures --db=threat_intel_v4'
    ];
    
    let cmdIndex = 0;
    
    function typeCommand() {
      if (!state.isLoaded) return;
      
      const text = commands[cmdIndex];
      dom.typingText.textContent = '';
      dom.typingText.style.opacity = '1';
      
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        dom.typingText.textContent += text[charIndex];
        charIndex++;
        
        if (charIndex === text.length) {
          clearInterval(typeInterval);
          // Pause then clear
          setTimeout(() => {
            dom.typingText.style.opacity = '0';
            cmdIndex = (cmdIndex + 1) % commands.length;
            setTimeout(typeCommand, 500);
          }, 2000);
        }
      }, 50 + Math.random() * 50);
    }
    
    // Start after loading
    setTimeout(typeCommand, 2500);
  }

  // --- ANIMATED COUNTERS ---
  function initAnimatedCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          animateValue(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    dom.statValues.forEach(el => observer.observe(el));
  }

  function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * ease);
      
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // --- LIVE THREAT FEED ---
  const feedData = {
    sources: ['NIDS-01', 'HIPS-04', 'FW-CORE', 'EDR-ALPHA', 'SINKHOLE-X', 'HONEY-POT-2'],
    messages: {
      critical: [
        'RCE attempt detected in Apache Struts',
        'Zero-day exploit payload intercepted',
        'Ransomware C2 beacon communication',
        'Privilege escalation via kernel module',
        'Critical data exfiltration detected'
      ],
      high: [
        'Brute force attack on SSH service',
        'SQL injection attempt on web portal',
        'Suspicious PowerShell execution',
        'Malware signature match: Trojan.Gen',
        'Unauthorized API access attempt'
      ],
      medium: [
        'Port scan detected from external IP',
        'Failed login attempt threshold reached',
        'Unusual outbound traffic volume',
        'Certificate validation warning',
        'Deprecated TLS version usage'
      ],
      low: [
        'Info: System update available',
        'Policy: Password rotation reminder',
        'Info: Backup job completed successfully',
        'Warning: Disk space usage > 80%',
        'Info: New user account created'
      ]
    }
  };

  function generateFeedItem() {
    const rand = Math.random();
    let severity;
    if (rand < 0.1) severity = 'critical';
    else if (rand < 0.35) severity = 'high';
    else if (rand < 0.7) severity = 'medium';
    else severity = 'low';

    const source = feedData.sources[utils.randomInt(0, feedData.sources.length - 1)];
    const message = feedData.messages[severity][utils.randomInt(0, feedData.messages[severity].length - 1)];
    const ip = utils.randomIP();
    const time = utils.formatTime(new Date());

    return { severity, source, message, ip, time };
  }

  function renderFeedItem(item) {
    const div = document.createElement('div');
    div.className = `feed-item ${item.severity}`;
    div.innerHTML = `
      <div class="feed-time">${item.time}</div>
      <div class="feed-severity ${item.severity}">${item.severity.toUpperCase()}</div>
      <div class="feed-message">[${item.ip}:${utils.randomPort()}] ${item.message}</div>
      <div class="feed-source">${item.source}</div>
    `;
    return div;
  }

  function initThreatFeed() {
    // Initial fill
    for (let i = 0; i < 15; i++) {
      const item = generateFeedItem();
      dom.feedList.appendChild(renderFeedItem(item));
      state.feedCount++;
    }
    dom.feedCount.textContent = state.feedCount;

    // Scroll to bottom
    dom.feedList.scrollTop = dom.feedList.scrollHeight;

    // Add new items periodically
    setInterval(() => {
      if (state.feedPaused) return;

      const item = generateFeedItem();
      const el = renderFeedItem(item);
      dom.feedList.insertBefore(el, dom.feedList.firstChild);
      state.feedCount++;
      dom.feedCount.textContent = state.feedCount;

      // Keep DOM light
      if (dom.feedList.children.length > 100) {
        dom.feedList.removeChild(dom.feedList.lastChild);
      }

      // Auto scroll if near bottom
      const threshold = 100;
      if (dom.feedList.scrollHeight - dom.feedList.scrollTop - dom.feedList.clientHeight < threshold) {
        dom.feedList.scrollTop = 0;
      }
    }, 3000);

    // Filters
    dom.feedFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.feedFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        const items = dom.feedList.querySelectorAll('.feed-item');
        
        items.forEach(item => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'grid';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- AUDIT LOGS ---
  const logData = {
    messages: [
      { msg: 'Connection established from 192.168.1.45', level: 'info' },
      { msg: 'Authentication failure for user admin', level: 'warning' },
      { msg: 'File integrity check passed: /etc/passwd', level: 'info' },
      { msg: 'Outbound connection blocked: 45.33.32.156', level: 'error' },
      { msg: 'Kernel module loaded: iptable_filter', level: 'info' },
      { msg: 'Privilege escalation attempt detected', level: 'critical' },
      { msg: 'Service restart: nginx', level: 'info' },
      { msg: 'Disk usage alert: /dev/sda1 at 92%', level: 'warning' },
      { msg: 'Intrusion signature match: ET POLICY', level: 'error' },
      { msg: 'User session timeout: id=8842', level: 'info' }
    ]
  };

  function generateLogEntry() {
    const data = logData.messages[utils.randomInt(0, logData.messages.length - 1)];
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const source = `SRC:${utils.randomIP()}:${utils.randomPort()}`;
    return { ...data, timestamp, source };
  }

  function renderLogEntry(entry) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.dataset.level = entry.level;
    div.innerHTML = `
      <span class="log-timestamp">${entry.timestamp}</span>
      <span class="log-level ${entry.level}">[${entry.level.toUpperCase()}]</span>
      <span class="log-message">${entry.msg}</span>
      <span class="log-source">${entry.source}</span>
    `;
    return div;
  }

  function initAuditLogs() {
    // Initial logs
    for (let i = 0; i < 20; i++) {
      const entry = generateLogEntry();
      dom.logBody.appendChild(renderLogEntry(entry));
    }
    dom.logBody.scrollTop = dom.logBody.scrollHeight;

    // Live logs
    setInterval(() => {
      if (state.logsPaused) return;
      const entry = generateLogEntry();
      dom.logBody.appendChild(renderLogEntry(entry));
      dom.logBody.scrollTop = dom.logBody.scrollHeight;
      
      if (dom.logBody.children.length > 200) {
        dom.logBody.removeChild(dom.logBody.firstChild);
      }
    }, 1500);

    // Controls
    dom.pauseLogsBtn.addEventListener('click', () => {
      state.logsPaused = !state.logsPaused;
      dom.pauseLogsBtn.textContent = state.logsPaused ? '▶ RESUME' : '⏸ PAUSE';
    });

    dom.clearLogsBtn.addEventListener('click', () => {
      dom.logBody.innerHTML = '';
    });

    dom.exportLogsBtn.addEventListener('click', () => {
      const logs = Array.from(dom.logBody.children).map(el => el.innerText).join('\n');
      const blob = new Blob([logs], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ciphersec_audit_log_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Filters
    document.getElementById('logLevelFilter').addEventListener('change', (e) => {
      const level = e.target.value;
      const entries = dom.logBody.querySelectorAll('.log-entry');
      entries.forEach(entry => {
        if (level === 'all' || entry.dataset.level === level) {
          entry.style.display = 'flex';
        } else {
          entry.style.display = 'none';
        }
      });
    });

    document.getElementById('logSearch').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const entries = dom.logBody.querySelectorAll('.log-entry');
      entries.forEach(entry => {
        const text = entry.innerText.toLowerCase();
        entry.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  }

  // --- NETWORK TOPOLOGY ---
  class NetworkNode {
    constructor(id, x, y, location, status) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = status === 'offline' ? 4 : (status === 'warning' ? 6 : 8);
      this.location = location;
      this.status = status;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(canvasWidth, canvasHeight) {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
      if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;

      // Keep in bounds
      this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));

      this.pulsePhase += 0.05;
    }

    draw(ctx, isHovered) {
      const pulse = Math.sin(this.pulsePhase) * 2;
      const currentRadius = isHovered ? this.radius * 1.5 : this.radius + (this.status === 'online' ? pulse : 0);
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      
      let color = '#00ff41'; // Online
      if (this.status === 'warning') color = '#ffcc00';
      if (this.status === 'offline') color = '#ff3333';
      
      ctx.fillStyle = color;
      ctx.fill();

      // Glow
      if (this.status === 'online' || isHovered) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius + 10, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? 'rgba(0, 255, 65, 0.3)' : 'rgba(0, 255, 65, 0.1)';
        ctx.fill();
      }

      // Label for hovered
      if (isHovered) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px "JetBrains Mono"';
        ctx.fillText(this.id, this.x + 15, this.y - 5);
        ctx.fillStyle = '#a0c0a0';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText(this.location, this.x + 15, this.y + 8);
      }
    }
  }

  function initNetworkTopology() {
    const canvas = dom.networkCanvas;
    const ctx = canvas.getContext('2d');
    let width, height;
    let hoveredNode = null;
    let selectedNodeId = 'NS-47A2';

    // Generate nodes
    const locations = ['FRANKFURT', 'LONDON', 'NYC', 'TOKYO', 'SYDNEY', 'SINGAPORE', 'TORONTO', 'AMSTERDAM'];
    for (let i = 0; i < 12; i++) {
      const id = `NS-${utils.randomHex(4)}`;
      const loc = locations[i % locations.length];
      const status = Math.random() > 0.1 ? (Math.random() > 0.1 ? 'online' : 'warning') : 'offline';
      state.networkNodes.push(new NetworkNode(id, Math.random() * 800 + 100, Math.random() * 400 + 50, loc, status));
    }

    // Populate sidebar list
    function updateNodeList() {
      dom.nodeList.innerHTML = '';
      state.networkNodes.forEach(node => {
        const div = document.createElement('div');
        div.className = `node-item ${node.id === selectedNodeId ? 'active' : ''}`;
        div.innerHTML = `
          <span class="node-id">${node.id}</span>
          <span class="node-status ${node.status}">${node.status.toUpperCase()}</span>
        `;
        div.addEventListener('click', () => {
          selectedNodeId = node.id;
          updateNodeList();
          updateNodeDetails(node);
        });
        dom.nodeList.appendChild(div);
      });
    }

    function updateNodeDetails(node) {
      dom.nodeDetails.innerHTML = `
        <div class="detail-row">
          <span class="detail-label">NODE ID:</span>
          <span class="detail-value">${node.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">LOCATION:</span>
          <span class="detail-value">${node.location}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">STATUS:</span>
          <span class="detail-value ${node.status}">${node.status.toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">LATENCY:</span>
          <span class="detail-value">${utils.randomInt(5, 120)}ms</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">THREATS BLOCKED:</span>
          <span class="detail-value">${utils.randomInt(100, 5000).toLocaleString()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">UPTIME:</span>
          <span class="detail-value">${(Math.random() * 5 + 95).toFixed(2)}%</span>
        </div>
      `;
      
      // Update sidebar panel status color
      const panelStatus = document.querySelector('.panel-status');
      panelStatus.textContent = node.status.toUpperCase();
      panelStatus.style.background = node.status === 'online' ? 'var(--green-primary)' : (node.status === 'warning' ? 'var(--medium)' : 'var(--critical)');
      panelStatus.style.color = node.status === 'offline' ? '#fff' : '#000';
    }

    function resize() {
      const container = canvas.parentElement;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      hoveredNode = null;
      for (const node of state.networkNodes) {
        const dist = Math.hypot(node.x - mx, node.y - my);
        if (dist < node.radius + 10) {
          hoveredNode = node;
          break;
        }
      }
      
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    });

    canvas.addEventListener('click', () => {
      if (hoveredNode) {
        selectedNodeId = hoveredNode.id;
        updateNodeList();
        updateNodeDetails(hoveredNode);
      }
    });

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < state.networkNodes.length; i++) {
        for (let j = i + 1; j < state.networkNodes.length; j++) {
          const n1 = state.networkNodes[i];
          const n2 = state.networkNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          
          if (dist < 150) {
            const alpha = 1 - (dist / 150);
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      state.networkNodes.forEach(node => {
        node.update(width, height);
        node.draw(ctx, node === hoveredNode);
      });

      requestAnimationFrame(animate);
    }

    updateNodeList();
    updateNodeDetails(state.networkNodes[0]);
    animate();
  }

  // --- SCROLL SPY & NAVIGATION ---
  function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          state.activeSection = id;
          
          dom.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // --- UPTIME COUNTER ---
  function initUptimeCounter() {
    const startTime = Date.now();
    
    setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      dom.uptimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  // --- INITIALIZE ALL ---
  function initAllSystems() {
    initCustomCursor();
    initTypingEffect();
    initAnimatedCounters();
    initThreatFeed();
    initAuditLogs();
    initNetworkTopology();
    initScrollSpy();
    initUptimeCounter();
  }

  // --- START ---
  initLoadingSequence();
});
/* ═══════════════════════════════════════════════════════════
   VOID//SEC — CYBERSECURITY OPERATIONS
   JavaScript Logic
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──── UTILS ──── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ──── 1. BOOT SEQUENCE ──── */
  const bootSequence = {
    init() {
      this.logEl = $('#boot-log');
      this.progressFill = $('#boot-progress-fill');
      this.bootScreen = $('#boot-sequence');
      this.mainContent = $('#main-content');
      
      this.messages = [
        { text: '> KERNEL: Loading core modules...', type: 'ok', delay: 200 },
        { text: '> NET: Establishing secure handshake...', type: 'ok', delay: 400 },
        { text: '> CRYPTO: Initializing AES-256-GCM...', type: 'ok', delay: 300 },
        { text: '> WARN: Unusual traffic detected on port 8080', type: 'warn', delay: 500 },
        { text: '> AUTH: Verifying clearance level 5...', type: 'ok', delay: 400 },
        { text: '> ERR: Connection timeout retrying...', type: 'err', delay: 300 },
        { text: '> NET: Connection re-established.', type: 'ok', delay: 200 },
        { text: '> SYS: Dashboard UI loaded.', type: 'ok', delay: 400 },
        { text: '> READY.', type: 'ok', delay: 200 }
      ];

      this.run();
    },

    run() {
      let totalDelay = 0;
      
      this.messages.forEach((msg, i) => {
        totalDelay += msg.delay;
        setTimeout(() => {
          this.addLog(msg.text, msg.type);
          this.updateProgress(((i + 1) / this.messages.length) * 100);
          
          if (i === this.messages.length - 1) {
            setTimeout(() => this.finish(), 600);
          }
        }, totalDelay);
      });
    },

    addLog(text, type) {
      const p = document.createElement('p');
      p.textContent = text;
      p.className = type;
      this.logEl.appendChild(p);
      
      // Trigger reflow for animation
      void p.offsetWidth; 
      p.classList.add('visible');
      
      // Auto scroll
      this.logEl.scrollTop = this.logEl.scrollHeight;
    },

    updateProgress(percent) {
      this.progressFill.style.width = `${percent}%`;
    },

    finish() {
      this.bootScreen.classList.add('exited');
      this.mainContent.classList.remove('hidden');
      this.mainContent.classList.add('visible');
      
      // Initialize other modules after boot
      setTimeout(() => {
        typewriter.init();
        counters.init();
        threatFeed.init();
        auditLog.init();
        attackMap.init();
        topology.init();
        decrypt.init();
        header.init();
        customCursor.init();
        scrollSpy.init();
        observer.init();
      }, 500);
    }
  };

  /* ──── 2. TYPEWRITER ──── */
  const typewriter = {
    init() {
      this.el = $('#hero-typewriter');
      this.texts = [
        "Proactive threat hunting and neutralization.",
        "Zero-day vulnerability assessment.",
        "24/7 Incident Response & Digital Forensics.",
        "Defending critical infrastructure globally."
      ];
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.type();
    },

    type() {
      const currentText = this.texts[this.textIndex];
      const cursor = '<span class="cursor"></span>';

      if (this.isDeleting) {
        this.el.innerHTML = currentText.substring(0, this.charIndex - 1) + cursor;
        this.charIndex--;
      } else {
        this.el.innerHTML = currentText.substring(0, this.charIndex + 1) + cursor;
        this.charIndex++;
      }

      let typeSpeed = this.isDeleting ? 30 : 60;

      if (!this.isDeleting && this.charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        typeSpeed = 500; // Pause before new word
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  };

  /* ──── 3. COUNTERS ──── */
  const counters = {
    init() {
      $$('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isFloat = target % 1 !== 0;
        
        // Simple counter animation
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          const current = start + (target - start) * easeOut;
          el.textContent = (isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString()) + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      });
    }
  };

  /* ──── 4. THREAT FEED ──── */
  const threatFeed = {
    data: [],
    count: 0,
    threats: {
      critical: [
        "RCE attempt on Apache Struts", "SQL Injection on /api/users", "Brute force SSH root", 
        "Zero-day exploit payload detected", "Ransomware C2 callback", "Critical Buffer Overflow"
      ],
      high: [
        "Privilege escalation attempt", "Unauthorized API access", "Malware signature match", 
        "DDoS amplification attack", "Suspicious outbound traffic", "XSS attempt on login form"
      ],
      medium: [
        "Port scan detected", "Invalid SSL certificate", "Failed login attempts > 10", 
        "Deprecated TLS version used", "Geo-anomalous login", "Policy violation: USB storage"
      ],
      low: [
        "Info disclosure risk", "Outdated software version", "Misconfigured header", 
        "Spam filter triggered", "Low volume ping sweep", "User agent spoofing"
      ]
    },
    ips: ["192.168.1.45", "10.0.0.12", "172.16.0.5", "8.8.8.8", "45.33.22.11", "104.18.32.7", "185.220.101.1"],
    
    init() {
      this.container = $('#threat-feed-body');
      this.countEl = $('#threat-count');
      
      // Initial batch
      for (let i = 0; i < 5; i++) {
        this.addThreat(false);
      }
      
      // Live updates
      setInterval(() => this.addThreat(true), 3000);
      
      // Tab filtering logic (simple visual toggle)
      $$('.feed-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          $$('.feed-tab').forEach(t => t.classList.remove('active'));
          e.target.classList.add('active');
          // In a real app, we would filter here. For now, just visual feedback.
        });
      });
    },

    addThreat(animate) {
      const severityRoll = Math.random();
      let severity = 'low';
      if (severityRoll > 0.9) severity = 'critical';
      else if (severityRoll > 0.75) severity = 'high';
      else if (severityRoll > 0.5) severity = 'medium';

      const desc = randomItem(this.threats[severity]);
      const ip = randomItem(this.ips);
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });

      const item = document.createElement('div');
      item.className = 'feed-item';
      item.innerHTML = `
        <span class="feed-time">${time}</span>
        <span class="feed-severity ${severity}">${severity.toUpperCase()}</span>
        <span class="feed-desc">${desc}</span>
        <span class="feed-src">SRC: ${ip}</span>
      `;

      if (animate && this.container.firstChild) {
        this.container.insertBefore(item, this.container.firstChild);
        // Keep DOM size manageable
        if (this.container.children.length > 20) {
          this.container.removeChild(this.container.lastChild);
        }
      } else {
        this.container.appendChild(item);
      }

      this.count++;
      this.countEl.textContent = this.count;
      
      // Update summary counts (simulated logic for visual balance)
      this.updateSummary(severity);
    },

    updateSummary(severity) {
      const el = $(`#${severity}-count`);
      if (el) {
        let val = parseInt(el.textContent);
        el.textContent = val + 1;
      }
    }
  };

  /* ──── 5. AUDIT LOG ──── */
  const auditLog = {
    init() {
      this.container = $('#audit-log-body');
      this.running = true;
      this.generateInitialLogs();
      setInterval(() => {
        if (this.running) this.addLog();
      }, 1500);
      
      // Controls
      $('#audit-play').onclick = () => this.running = true;
      $('#audit-pause').onclick = () => this.running = false;
      $('#audit-clear').onclick = () => this.container.innerHTML = '';
    },

    generateInitialLogs() {
      const logs = [
        { level: 'info', msg: 'System startup sequence initiated.' },
        { level: 'success', msg: 'Firewall rules updated successfully.' },
        { level: 'warn', msg: 'High memory usage detected on Node-04.' },
        { level: 'info', msg: 'User admin logged in from 192.168.1.10.' },
        { level: 'success', msg: 'Daily backup completed.' },
        { level: 'error', msg: 'Connection refused to external API.' },
      ];
      logs.forEach(l => this.addLogEntry(l.level, l.msg, true));
    },

    addLog() {
      const levels = ['info', 'info', 'info', 'success', 'warn', 'error'];
      const messages = [
        'Packet inspection routine completed.',
        'Heuristic analysis triggered on PID 492.',
        'Database integrity check passed.',
        'New threat signature added to database.',
        'Anomalous traffic pattern detected.',
        'SSL handshake failure with client.',
        'Scheduled scan of /var/www started.',
        'Access denied for user guest.',
        'Kernel module loaded: mod_security.',
        'Cron job executed: log_rotation.'
      ];
      
      const level = randomItem(levels);
      const msg = randomItem(messages);
      this.addLogEntry(level, msg, false);
    },

    addLogEntry(level, msg, skipScroll) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-level ${level}">${level.toUpperCase()}</span>
        <span class="log-msg">${msg}</span>
      `;
      this.container.appendChild(entry);
      
      // Limit entries
      if (this.container.children.length > 50) {
        this.container.removeChild(this.container.firstChild);
      }
      
      if (!skipScroll) {
        this.container.scrollTop = this.container.scrollHeight;
      }
    }
  };

  /* ──── 6. ATTACK MAP (CANVAS) ──── */
  const attackMap = {
    init() {
      this.canvas = $('#attack-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.arcs = [];
      this.nodes = [];
      
      // Generate random nodes representing "cities/servers"
      this.generateNodes();
      
      // Generate initial arcs
      for (let i = 0; i < 15; i++) {
        this.addArc();
      }

      this.animate();
      setInterval(() => this.addArc(), 2000);
    },

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    },

    generateNodes() {
      // Create a grid of nodes
      const cols = 10;
      const rows = 6;
      const padX = this.canvas.width / (cols + 1);
      const padY = this.canvas.height / (rows + 1);
      
      for (let i = 1; i <= cols; i++) {
        for (let j = 1; j <= rows; j++) {
          // Add some randomness
          const x = i * padX + random(-20, 20);
          const y = j * padY + random(-20, 20);
          this.nodes.push({ x, y, r: random(1, 2), active: false });
        }
      }
    },

    addArc() {
      const from = randomItem(this.nodes);
      let to = randomItem(this.nodes);
      while (from === to) to = randomItem(this.nodes);
      
      this.arcs.push({
        from, to,
        progress: 0,
        speed: 0.01 + Math.random() * 0.02,
        severity: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'high' : 'medium'
      });
    },

    animate() {
      this.ctx.fillStyle = 'rgba(13, 13, 20, 0.1)'; // Trail effect
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw nodes
      this.ctx.fillStyle = '#1a1a24';
      this.nodes.forEach(n => {
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Draw arcs
      for (let i = this.arcs.length - 1; i >= 0; i--) {
        const arc = this.arcs[i];
        arc.progress += arc.speed;

        if (arc.progress >= 1) {
          this.arcs.splice(i, 1);
          continue;
        }

        // Bezier curve
        const cpX = (arc.from.x + arc.to.x) / 2 + (Math.random() - 0.5) * 100;
        const cpY = (arc.from.y + arc.to.y) / 2 + (Math.random() - 0.5) * 100;

        this.ctx.beginPath();
        this.ctx.moveTo(arc.from.x, arc.from.y);
        this.ctx.quadraticCurveTo(cpX, cpY, 
          arc.from.x + (arc.to.x - arc.from.x) * arc.progress, 
          arc.from.y + (arc.to.y - arc.from.y) * arc.progress
        );
        
        let color = '#00ffff';
        if (arc.severity === 'high') color = '#ff8c00';
        if (arc.severity === 'critical') color = '#ff2a2a';

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.5;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // Draw head dot
        const headX = arc.from.x + (arc.to.x - arc.from.x) * arc.progress;
        const headY = arc.from.y + (arc.to.y - arc.from.y) * arc.progress;
        this.ctx.beginPath();
        this.ctx.arc(headX, headY, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
      }

      // Update stats
      $('#active-attacks').textContent = this.arcs.length;
      $('#origin-countries').textContent = random(12, 25);
      $('#targeted-sectors').textContent = random(4, 8);

      requestAnimationFrame(() => this.animate());
    }
  };

  /* ──── 7. TOPOLOGY (CANVAS) ──── */
  const topology = {
    init() {
      this.canvas = $('#topology-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.edges = [];
      this.mouse = { x: -100, y: -100 };
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      this.createTopology();
      
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.checkHover();
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = -100;
        this.mouse.y = -100;
        this.updateInfoPanel(null);
      });

      this.animate();
    },

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    },

    createTopology() {
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      
      // Layout: Internet -> Firewall -> LB -> Web -> DB
      const layout = [
        { id: 'inet', x: cx, y: cy - 180, type: 'endpoint', label: 'INTERNET', ip: 'External' },
        { id: 'fw', x: cx, y: cy - 90, type: 'firewall', label: 'WAF / FIREWALL', ip: '10.0.0.1' },
        { id: 'lb', x: cx, y: cy, type: 'server', label: 'LOAD BALANCER', ip: '10.0.0.2' },
        { id: 'web1', x: cx - 100, y: cy + 90, type: 'server', label: 'WEB-NODE-01', ip: '10.0.1.1' },
        { id: 'web2', x: cx + 100, y: cy + 90, type: 'server', label: 'WEB-NODE-02', ip: '10.0.1.2' },
        { id: 'db', x: cx, y: cy + 180, type: 'database', label: 'PRIMARY DB', ip: '10.0.2.1' },
        { id: 'db2', x: cx + 150, y: cy + 180, type: 'database', label: 'REPLICA DB', ip: '10.0.2.2' },
      ];

      layout.forEach(l => {
        this.nodes.push({ ...l, r: 15, pulse: 0, hovered: false });
      });

      this.edges = [
        ['inet', 'fw'], ['fw', 'lb'], ['lb', 'web1'], ['lb', 'web2'], 
        ['web1', 'db'], ['web2', 'db'], ['db', 'db2']
      ];
    },

    checkHover() {
      let hit = null;
      this.nodes.forEach(n => {
        const dist = Math.hypot(this.mouse.x - n.x, this.mouse.y - n.y);
        n.hovered = dist < 20;
        if (n.hovered) hit = n;
      });
      this.updateInfoPanel(hit);
    },

    updateInfoPanel(node) {
      const panel = $('#topology-info');
      if (node) {
        panel.querySelector('.info-label').textContent = `${node.type.toUpperCase()} DETECTED`;
        panel.querySelector('.info-content').innerHTML = `ID: ${node.id}<br>LABEL: ${node.label}<br>IP: ${node.ip}<br>STATUS: <span style="color: #39ff14">ONLINE</span>`;
      } else {
        panel.querySelector('.info-label').textContent = 'HOVER OVER NODE FOR DETAILS';
        panel.querySelector('.info-content').textContent = '—';
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Grid background
      this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)';
      this.ctx.lineWidth = 1;
      for (let x = 0; x < this.canvas.width; x += 30) {
        this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
      }
      for (let y = 0; y < this.canvas.height; y += 30) {
        this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
      }

      // Draw edges
      this.edges.forEach(([fromId, toId]) => {
        const from = this.nodes.find(n => n.id === fromId);
        const to = this.nodes.find(n => n.id === toId);
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Moving dot
        const time = Date.now() / 1000;
        const t = (Math.sin(time + from.x) + 1) / 2;
        const dx = from.x + (to.x - from.x) * t;
        const dy = from.y + (to.y - from.y) * t;
        this.ctx.beginPath();
        this.ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#39ff14';
        this.ctx.fill();
      });

      // Draw nodes
      this.nodes.forEach(n => {
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        
        let color = '#00ffff';
        if (n.type === 'firewall') color = '#ff2a2a';
        if (n.type === 'server') color = '#39ff14';
        if (n.type === 'database') color = '#f5e642';
        if (n.type === 'endpoint') color = '#ff8c00';

        this.ctx.fillStyle = n.hovered ? '#ffffff' : color;
        this.ctx.shadowBlur = n.hovered ? 20 : 10;
        this.ctx.shadowColor = color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Label
        this.ctx.fillStyle = n.hovered ? '#ffffff' : '#8a8a9a';
        this.ctx.font = '10px "Fira Code"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.label, n.x, n.y + 25);
      });

      requestAnimationFrame(() => this.animate());
    }
  };

  /* ──── 8. DECRYPT INTEL ──── */
  const decrypt = {
    init() {
      $$('.decrypt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const card = btn.closest('.intel-card');
          const encrypted = card.querySelector('.intel-encrypted-content');
          const decrypted = card.querySelector('.intel-decrypted-content');
          
          // Animate
          btn.textContent = 'DECRYPTING...';
          
          setTimeout(() => {
            encrypted.style.display = 'none';
            decrypted.classList.remove('hidden');
            decrypted.style.animation = 'slide-in-left 0.5s ease forwards';
            card.classList.remove('encrypted');
          }, 800);
        });
      });
    }
  };

  /* ──── 9. HEADER & UI ──── */
  const header = {
    init() {
      this.updateClock();
      setInterval(() => this.updateClock(), 1000);
      
      // Mobile menu
      $('#menu-toggle').addEventListener('click', () => {
        $('#main-nav').classList.toggle('open');
      });

      // Close menu on link click
      $$('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          $('#main-nav').classList.remove('open');
        });
      });
    },

    updateClock() {
      const now = new Date();
      $('#header-clock').textContent = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    }
  };

  const scrollSpy = {
    init() {
      window.addEventListener('scroll', () => {
        let current = '';
        $$('section').forEach(section => {
          const sectionTop = section.offsetTop;
          if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
          }
        });

        $$('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
          }
        });
      });
    }
  };

  /* ──── 10. CUSTOM CURSOR ──── */
  const customCursor = {
    init() {
      this.cursor = $('.custom-cursor');
      this.dot = $('.cursor-dot');
      
      if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch
      
      document.addEventListener('mousemove', (e) => {
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';
        this.dot.style.left = e.clientX + 'px';
        this.dot.style.top = e.clientY + 'px';
      });

      // Hover effects
      const hoverables = 'a, button, .feed-tab, .protocol-card, .intel-card';
      $$(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
          this.cursor.style.borderColor = '#39ff14';
          this.cursor.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
          this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          this.cursor.style.borderColor = '#39ff14';
          this.cursor.style.boxShadow = '0 0 10px rgba(57, 255, 20, 0.5)';
        });
      });
    }
  };

  /* ──── 11. INTERSECTION OBSERVER (Progress bars) ──── */
  const observer = {
    init() {
      const options = { threshold: 0.3 };
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.progress-fill');
            if (fill) {
              fill.style.width = fill.dataset.width + '%';
            }
            obs.unobserve(entry.target);
          }
        });
      }, options);

      $$('.protocol-card').forEach(card => obs.observe(card));
    }
  };

  /* ──── 12. FORM HANDLING ──── */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = $('#form-status');
      const btn = form.querySelector('.btn-text');
      
      btn.textContent = 'TRANSMITTING...';
      status.textContent = '';
      
      setTimeout(() => {
        status.textContent = 'MESSAGE ENCRYPTED AND SENT SUCCESSFULLY.';
        status.className = 'form-status success';
        btn.textContent = 'TRANSMIT SECURE MESSAGE';
        form.reset();
        
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      }, 1500);
    });
  }

  /* ──── START ──── */
  document.addEventListener('DOMContentLoaded', () => {
    bootSequence.init();
  });

})();
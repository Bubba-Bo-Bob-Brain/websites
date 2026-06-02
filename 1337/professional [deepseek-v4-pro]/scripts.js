document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.panel');
  const liveTimestamp = document.getElementById('live-timestamp');
  const liveFeedList = document.getElementById('live-feed-list');
  const auditLogContainer = document.getElementById('audit-log-container');
  const cpuLoad = document.getElementById('cpu-load');
  const memLoad = document.getElementById('mem-load');
  const decryptBtn = document.getElementById('decrypt-btn');
  const keyInput = document.getElementById('key-input');
  const decryptedMessageSpan = document.getElementById('decrypted-message');
  const worldMapGrid = document.getElementById('world-map');
  const mapTooltip = document.getElementById('map-tooltip');
  const topoCanvas = document.getElementById('topoCanvas');

  function updateTimestamp() {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    if (liveTimestamp) liveTimestamp.textContent = formatted;
  }
  updateTimestamp();
  setInterval(updateTimestamp, 1000);

  function switchPanel(panelId) {
    panels.forEach(panel => panel.classList.remove('active'));
    const activePanel = document.getElementById(`panel-${panelId}`);
    if (activePanel) activePanel.classList.add('active');

    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-panel="${panelId}"]`);
    if (activeNav) activeNav.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const panelId = item.getAttribute('data-panel');
      if (panelId) switchPanel(panelId);
    });
  });

  const feedThreats = [
    { time: '22:45:23', type: 'EXPLOIT', desc: 'CVE-2024-21887 — Command Injection on node 0x4F2A' },
    { time: '22:45:12', type: 'MALWARE', desc: 'Trojan.Win32.Agent signature match in subnet 10.8.0.0/24' },
    { time: '22:45:01', type: 'BREACH', desc: 'Possible data exfiltration from DB_PRIMARY — 2.4GB outbound' },
    { time: '22:44:45', type: 'EXPLOIT', desc: 'Log4Shell callback detected from 45.155.205.233' },
    { time: '22:44:20', type: 'MALWARE', desc: 'Ransomware variant LockBit pattern identified' }
  ];

  function addLiveFeedEntry() {
    if (!liveFeedList) return;
    const randomThreat = feedThreats[Math.floor(Math.random() * feedThreats.length)];
    const entry = document.createElement('div');
    entry.className = 'feed-item';
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);
    entry.innerHTML = `<span class="feed-time">${timeStr}</span><span class="feed-type ${randomThreat.type.toLowerCase()}">${randomThreat.type}</span><span class="feed-desc">${randomThreat.desc}</span>`;
    liveFeedList.prepend(entry);
    if (liveFeedList.children.length > 8) {
      liveFeedList.removeChild(liveFeedList.lastChild);
    }
  }

  setInterval(addLiveFeedEntry, 4500);

  const logEntries = [
    { type: 'warn', text: 'Failed SSH attempt from 185.220.101.34 — user: root' },
    { type: 'error', text: 'Kernel integrity check FAILED — /bin/ps modified' },
    { type: 'info', text: 'Firewall rule updated: DROP inbound port 3389' },
    { type: 'warn', text: 'Unusual outbound traffic to 198.51.100.23:443' },
    { type: 'error', text: 'SELinux alert: attempted privilege escalation' }
  ];

  function addAuditLogEntry() {
    if (!auditLogContainer) return;
    const randomLog = logEntries[Math.floor(Math.random() * logEntries.length)];
    const entry = document.createElement('div');
    entry.className = `log-entry ${randomLog.type}`;
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);
    entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${randomLog.text}`;
    auditLogContainer.prepend(entry);
    if (auditLogContainer.children.length > 12) {
      auditLogContainer.removeChild(auditLogContainer.lastChild);
    }
  }

  setInterval(addAuditLogEntry, 7000);

  function updateSystemStats() {
    const cpu = Math.floor(Math.random() * 35 + 15);
    const mem = Math.floor(Math.random() * 200 + 320);
    if (cpuLoad) cpuLoad.textContent = `CPU: ${cpu}%`;
    if (memLoad) memLoad.textContent = `MEM: ${mem}MB`;
  }
  setInterval(updateSystemStats, 3000);

  if (decryptBtn && keyInput && decryptedMessageSpan) {
    decryptBtn.addEventListener('click', () => {
      const key = keyInput.value.trim();
      if (key === 'NEXUS-1337' || key === 'nexus-1337') {
        decryptedMessageSpan.textContent = 'ACCESS GRANTED: Target coordinates 34.0522° N, 118.2437° W. Rendezvous at 0300 hours.';
        decryptedMessageSpan.style.color = 'var(--neon-lime)';
      } else if (key.length > 0) {
        decryptedMessageSpan.textContent = 'INVALID KEY. INTRUSION DETECTED. TRACE INITIATED.';
        decryptedMessageSpan.style.color = 'var(--neon-red)';
      } else {
        decryptedMessageSpan.textContent = 'AWAITING KEY...';
        decryptedMessageSpan.style.color = 'var(--text-dim)';
      }
    });
  }

  function generateWorldMap() {
    if (!worldMapGrid) return;
    worldMapGrid.innerHTML = '';
    const threatPoints = [
      { row: 2, col: 13, severity: 'critical', label: 'CN - APT41' },
      { row: 3, col: 5, severity: 'high', label: 'US - CISA Alert' },
      { row: 1, col: 11, severity: 'medium', label: 'RU - Cozy Bear' },
      { row: 4, col: 15, severity: 'critical', label: 'KP - Lazarus' },
      { row: 3, col: 9, severity: 'high', label: 'IR - MuddyWater' }
    ];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 18; c++) {
        const cell = document.createElement('div');
        cell.style.background = '#0d1410';
        cell.style.borderRadius = '2px';
        const threat = threatPoints.find(t => t.row === r && t.col === c);
        if (threat) {
          cell.style.background = threat.severity === 'critical' ? '#ff3333' : (threat.severity === 'high' ? '#ffb347' : '#00e5ff');
          cell.style.boxShadow = `0 0 12px ${cell.style.background}`;
          cell.dataset.label = threat.label;
          cell.addEventListener('mouseenter', (e) => {
            mapTooltip.style.display = 'block';
            mapTooltip.textContent = threat.label;
            mapTooltip.style.left = e.pageX - worldMapGrid.getBoundingClientRect().left + 15 + 'px';
            mapTooltip.style.top = e.pageY - worldMapGrid.getBoundingClientRect().top - 30 + 'px';
          });
          cell.addEventListener('mouseleave', () => {
            mapTooltip.style.display = 'none';
          });
        }
        worldMapGrid.appendChild(cell);
      }
    }
  }
  generateWorldMap();

  function drawTopology() {
    if (!topoCanvas) return;
    const ctx = topoCanvas.getContext('2d');
    const w = topoCanvas.width = topoCanvas.clientWidth || 400;
    const h = topoCanvas.height = 180;

    ctx.clearRect(0, 0, w, h);
    const nodes = [
      { x: 50, y: 50 }, { x: 180, y: 30 }, { x: 300, y: 70 },
      { x: 120, y: 120 }, { x: 250, y: 140 }, { x: 350, y: 110 }
    ];

    ctx.strokeStyle = '#1f3320';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.4) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node, idx) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#33ff33' : '#1a8c1a';
      ctx.fill();
      ctx.shadowColor = '#33ff33';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#0a0c0b';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    let packetX = 50;
    let packetY = 50;
    let targetIdx = 1;
    function animatePacket() {
      ctx.clearRect(0, 0, w, h);
      drawStaticTopology(ctx, nodes, w, h);
      const target = nodes[targetIdx];
      packetX += (target.x - packetX) * 0.08;
      packetY += (target.y - packetY) * 0.08;
      ctx.beginPath();
      ctx.arc(packetX, packetY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (Math.abs(packetX - target.x) < 1 && Math.abs(packetY - target.y) < 1) {
        targetIdx = (targetIdx + 1) % nodes.length;
      }
      requestAnimationFrame(animatePacket);
    }

    function drawStaticTopology(context, nodeList, width, height) {
      context.strokeStyle = '#1f3320';
      context.lineWidth = 1.5;
      for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
          context.beginPath();
          context.moveTo(nodeList[i].x, nodeList[i].y);
          context.lineTo(nodeList[j].x, nodeList[j].y);
          context.stroke();
        }
      }
      nodeList.forEach((node, idx) => {
        context.beginPath();
        context.arc(node.x, node.y, 6, 0, Math.PI * 2);
        context.fillStyle = idx === 0 ? '#33ff33' : '#1a8c1a';
        context.fill();
        context.strokeStyle = '#0a0c0b';
        context.stroke();
      });
    }

    animatePacket();
  }

  drawTopology();
  window.addEventListener('resize', drawTopology);
});
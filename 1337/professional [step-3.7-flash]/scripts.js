document.addEventListener('DOMContentLoaded', () => {
  initUTCClock();
  initTerminalTyping();
  initThreatFeed();
  initTopology();
  initEncryptedMessage();
  initAuditLogs();
  initThreatsCounter();
  initNavActiveState();
  initCTAButton();
  initTitleGlitchEffect();
});

function initUTCClock() {
  const utcTimeEl = document.getElementById('utc-time');
  function updateTime() {
    const now = new Date();
    utcTimeEl.textContent = now.toISOString().slice(11, 19) + ' UTC';
  }
  setInterval(updateTime, 1000);
  updateTime();
}

function initTerminalTyping() {
  const terminalLines = document.querySelectorAll('.terminal-line');
  const originalTexts = Array.from(terminalLines).map(line => line.textContent);
  terminalLines.forEach(line => line.textContent = '');
  let currentLine = 0;
  let currentChar = 0;
  const typingSpeed = 30;

  function typeNextChar() {
    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine];
      const fullText = originalTexts[currentLine];
      if (currentChar < fullText.length) {
        line.textContent += fullText[currentChar];
        currentChar++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        currentLine++;
        currentChar = 0;
        setTimeout(typeNextChar, 300);
      }
    } else {
      const lastLine = terminalLines[terminalLines.length - 1];
      const cursor = document.createElement('span');
      cursor.className = 'blinking-cursor';
      cursor.textContent = '_';
      lastLine.appendChild(cursor);
    }
  }
  setTimeout(typeNextChar, 1000);
  setInterval(addSystemTerminalMessage, Math.random() * 15000 + 15000);
}

function addSystemTerminalMessage() {
  const terminalBody = document.getElementById('hero-terminal');
  const systemMessages = [
    `Blocked malicious IP: ${generateRandomIP()}`,
    `New vulnerability detected: CVE-2024-${Math.floor(Math.random() * 9000) + 1000}`,
    `Intrusion attempt blocked from ${generateRandomIP()}`,
    `System scan completed: 0 threats found`,
    `Firewall rule updated: blocked ${Math.floor(Math.random() * 20) + 1} IPs`,
    `Encrypted connection established with client ${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  ];
  const message = systemMessages[Math.floor(Math.random() * systemMessages.length)];
  const time = new Date().toISOString().slice(11, 19);
  
  const line = document.createElement('p');
  line.className = 'terminal-line';
  line.textContent = `[${time}] ${message}`;
  line.style.opacity = '0';
  line.style.transform = 'translateX(-10px)';
  line.style.transition = 'all 0.3s ease';
  
  terminalBody.appendChild(line);
  requestAnimationFrame(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateX(0)';
  });
  terminalBody.scrollTop = terminalBody.scrollHeight;
  
  if (terminalBody.children.length > 15) {
    terminalBody.removeChild(terminalBody.firstChild);
  }
}

function initThreatFeed() {
  const threatTypes = ['RANSOMWARE', 'ZERO-DAY EXPLOIT', 'PHISHING CAMPAIGN', 'PORT SCAN', 'DDoS ATTACK', 'SQL INJECTION', 'BRUTE FORCE', 'MALWARE DEPLOYMENT'];
  const threatTargets = ['FINANCIAL SERVICES SECTOR', 'HEALTHCARE PROVIDERS', 'GOVERNMENT AGENCIES', 'EDGE NETWORK', 'CLOUD INFRASTRUCTURE', 'IoT DEVICES', 'ENTERPRISE NETWORKS', 'CRITICAL INFRASTRUCTURE'];
  const severities = [
    { class: 'severity-critical', label: 'CRITICAL', status: 'ACTIVE' },
    { class: 'severity-high', label: 'HIGH', status: 'PATCH PENDING' },
    { class: 'severity-medium', label: 'MEDIUM', status: 'MITIGATED' },
    { class: 'severity-low', label: 'LOW', status: 'BLOCKED' }
  ];

  function generateThreatEntry() {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC';
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const target = threatTargets[Math.floor(Math.random() * threatTargets.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const entry = document.createElement('div');
    entry.className = `threat-entry ${severity.class}`;
    entry.innerHTML = `
      <span class="threat-time">${timeStr}</span>
      <span class="threat-type">${type}</span>
      <span class="threat-target">${target}</span>
      <span class="threat-severity">${severity.label}</span>
      <span class="threat-status">${severity.status}</span>
    `;
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-10px)';
    entry.style.transition = 'all 0.3s ease';
    
    const feedList = document.getElementById('threat-feed-list');
    feedList.insertBefore(entry, feedList.firstChild);
    
    requestAnimationFrame(() => {
      entry.style.opacity = '1';
      entry.style.transform = 'translateY(0)';
    });
    
    if (feedList.children.length > 10) {
      feedList.removeChild(feedList.lastChild);
    }
  }

  setTimeout(() => {
    generateThreatEntry();
    setInterval(() => generateThreatEntry(), Math.random() * 6000 + 4000);
  }, 2000);
}

function initTopology() {
  const topologyNodes = document.querySelectorAll('.topology-node');
  const topologyContainer = document.querySelector('.topology-container');
  const topologySvg = document.querySelector('.topology-edges');
  const connections = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [2, 5], [2, 6], [3, 6], [3, 7]
  ];

  function drawTopologyEdges() {
    topologySvg.innerHTML = '';
    const containerRect = topologyContainer.getBoundingClientRect();
    
    connections.forEach(([fromIdx, toIdx]) => {
      const fromNode = topologyNodes[fromIdx];
      const toNode = topologyNodes[toIdx];
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      
      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(0, 255, 65, 0.3)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4 2');
      
      topologySvg.appendChild(line);
    });
  }

  window.addEventListener('load', drawTopologyEdges);
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawTopologyEdges, 100);
  });

  topologyNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'topology-tooltip';
      tooltip.textContent = `${node.dataset.node} | STATUS: ONLINE | TRAFFIC: ${(Math.random() * 5 + 0.5).toFixed(1)}Gbps`;
      document.body.appendChild(tooltip);
      
      const rect = node.getBoundingClientRect();
      tooltip.style.position = 'fixed';
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.background = 'var(--bg-card)';
      tooltip.style.border = '1px solid var(--lime-dim)';
      tooltip.style.color = 'var(--lime-primary)';
      tooltip.style.padding = '6px 10px';
      tooltip.style.borderRadius = '2px';
      tooltip.style.fontSize = '0.75rem';
      tooltip.style.fontFamily = 'var(--font-mono)';
      tooltip.style.zIndex = '1000';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.boxShadow = '0 0 10px var(--lime-glow)';
      
      node._tooltip = tooltip;
    });
    
    node.addEventListener('mouseleave', () => {
      if (node._tooltip) {
        node._tooltip.remove();
        node._tooltip = null;
      }
    });
  });
}

function initEncryptedMessage() {
  const decryptBtn = document.getElementById('decrypt-btn');
  const encryptBtn = document.getElementById('encrypt-btn');
  const decryptKeyInput = document.getElementById('decrypt-key');
  const encryptedOutput = document.getElementById('encrypted-output');
  const decryptedOutput = document.getElementById('decrypted-output');
  const correctKey = 'EXPERT2024';

  function scrambleText(element, finalText, duration = 500) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const originalText = element.textContent;
    let iterations = 0;
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return finalText[index] || '';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        element.textContent = finalText;
      }
      iterations += 1 / 2;
    }, duration / (originalText.length * 2));
  }

  decryptBtn.addEventListener('click', () => {
    const inputKey = decryptKeyInput.value.trim();
    if (inputKey === correctKey) {
      encryptedOutput.classList.add('hidden');
      decryptedOutput.classList.remove('hidden');
      scrambleText(decryptedOutput, decryptedOutput.textContent, 800);
    } else {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'ERROR: INVALID DECRYPTION KEY';
      errorMsg.style.color = 'var(--red-alert)';
      errorMsg.style.marginTop = '10px';
      errorMsg.style.fontWeight = 'bold';
      document.querySelector('.encryption-controls').appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 2000);
    }
  });

  encryptBtn.addEventListener('click', () => {
    decryptedOutput.classList.add('hidden');
    encryptedOutput.classList.remove('hidden');
    scrambleText(encryptedOutput, encryptedOutput.textContent, 800);
  });
}

function initAuditLogs() {
  const logMessages = {
    info: [
      'User {user} logged in from {ip} (trusted IP)',
      'Automated vulnerability scan completed: {count} new CVEs identified',
      'System backup completed successfully',
      'Firewall rules updated: {count} new malicious IPs blocked',
      'SSL certificate renewed for {domain}',
      'User session expired for inactive account'
    ],
    warn: [
      'Failed login attempt for user {user} from {ip} ({count}th attempt in 10m)',
      'Unusual traffic detected from {ip}',
      'Certificate expiration warning for {domain} (7 days remaining)',
      'High CPU usage detected on {server}',
      'Disk space low on {server} (85% used)'
    ],
    error: [
      'Intrusion detection alert: Suspicious {attack} attempt on {endpoint}',
      'Failed to connect to backup server',
      'Service {service} crashed, restarting...',
      'Authentication service timeout for user {user}',
      'File integrity check failed for {file}'
    ],
    critical: [
      'Brute force attack detected on SSH port 22: {count} attempts blocked in 5m',
      'Ransomware activity detected on endpoint {endpoint}',
      'Data exfiltration attempt blocked from {ip}',
      'Critical system failure in {service}, failover initiated',
      'Unauthorized access attempt to restricted database'
    ]
  };
  const users = ['admin', 'root', 'jsmith', 'mgarcia', 'lwilson'];
  const ips = ['192.168.1.%d', '10.0.0.%d', '203.0.113.%d', '198.51.100.%d'];
  const servers = ['WEB_SERVER_01', 'WEB_SERVER_02', 'PRIMARY_DB', 'CORE_SWITCH'];
  const domains = ['cybersec.expert', 'clientportal.com', 'api.service.io'];
  const attacks = ['SQL injection', 'XSS', 'CSRF', 'command injection', 'path traversal'];
  const endpoints = ['/api/v1/users', '/admin/dashboard', '/login', '/api/v2/data'];
  const files = ['/etc/passwd', '/config/db.conf', '/var/log/auth.log'];
  const services = ['nginx', 'mysql', 'ssh', 'firewall', 'ids'];

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRandomIP() {
    return getRandomItem(ips).replace('%d', Math.floor(Math.random() * 254) + 1);
  }

  function generateLogEntry() {
    const levels = ['info', 'warn', 'error', 'critical'];
    const level = Math.random() < 0.5 ? 'info' : Math.random() < 0.7 ? 'warn' : Math.random() < 0.9 ? 'error' : 'critical';
    const messageTemplate = getRandomItem(logMessages[level]);
    
    let message = messageTemplate
      .replace('{user}', getRandomItem(users))
      .replace('{ip}', generateRandomIP())
      .replace('{count}', Math.floor(Math.random() * 1000) + 10)
      .replace('{server}', getRandomItem(servers))
      .replace('{domain}', getRandomItem(domains))
      .replace('{attack}', getRandomItem(attacks))
      .replace('{endpoint}', getRandomItem(endpoints))
      .replace('{file}', getRandomItem(files))
      .replace('{service}', getRandomItem(services));
    
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC';
    const levelLabel = level.toUpperCase();
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${level}`;
    entry.innerHTML = `
      <span class="log-time">${timeStr}</span>
      <span class="log-level">[${levelLabel}]</span>
      <span class="log-message">${message}</span>
    `;
    entry.style.opacity = '0';
    entry.style.transform = 'translateX(-10px)';
    entry.style.transition = 'all 0.3s ease';
    
    const logList = document.getElementById('audit-log-list');
    logList.insertBefore(entry, logList.firstChild);
    
    requestAnimationFrame(() => {
      entry.style.opacity = '1';
      entry.style.transform = 'translateX(0)';
    });
    
    if (logList.children.length > 15) {
      logList.removeChild(logList.lastChild);
    }
  }

  setTimeout(() => {
    generateLogEntry();
    setInterval(() => generateLogEntry(), Math.random() * 4000 + 3000);
  }, 1500);
}

function initThreatsCounter() {
  const threatsBlockedEl = document.getElementById('threats-blocked');
  let currentThreats = 1247892;
  
  function updateCounter() {
    const increment = Math.floor(Math.random() * 50) + 5;
    currentThreats += increment;
    threatsBlockedEl.textContent = currentThreats.toLocaleString();
  }
  setInterval(updateCounter, Math.random() * 3000 + 2000);
}

function initNavActiveState() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initCTAButton() {
  const ctaButton = document.getElementById('access-briefs');
  ctaButton.addEventListener('click', () => {
    document.getElementById('threat-feed').scrollIntoView({ behavior: 'smooth' });
  });
}

function initTitleGlitchEffect() {
  const siteTitle = document.querySelector('.site-title');
  siteTitle.addEventListener('mouseenter', () => {
    let glitchInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 4;
      const offsetY = (Math.random() - 0.5) * 2;
      siteTitle.style.textShadow = `
        ${offsetX}px ${offsetY}px 0 rgba(255, 0, 64, 0.7),
        ${-offsetX}px ${-offsetY}px 0 rgba(0, 204, 255, 0.7),
        0 0 10px var(--lime-glow)
      `;
      siteTitle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }, 50);
    
    setTimeout(() => {
      clearInterval(glitchInterval);
      siteTitle.style.textShadow = '0 0 10px var(--lime-glow), 0 0 20px var(--lime-glow), 0 0 40px var(--lime-glow)';
      siteTitle.style.transform = 'translate(0, 0)';
    }, 300);
  });
}

function generateRandomIP() {
  const octets = Array.from({length: 4}, () => Math.floor(Math.random() * 254) + 1);
  return octets.join('.');
}
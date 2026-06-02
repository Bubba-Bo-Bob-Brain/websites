document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ===================== CLOCK =====================
  const clockEl = document.getElementById('clock');
  
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);

  // ===================== TYPING EFFECT =====================
  const typingText = document.getElementById('typing-text');
  const phrases = [
    'INITIALIZING_SECURITY_PROTOCOLS...',
    'SCANNING_NETWORK_INFRASTRUCTURE...',
    'LOADING_THREAT_INTELLIGENCE...',
    'DECRYPTING_ENCRYPTED_CHANNELS...',
    'MONITORING_ACTIVE_CONNECTIONS...',
    'ANALYZING_PACKET_CAPTURES...'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 300;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ===================== THREAT FEED =====================
  const threatFeed = document.getElementById('threatFeed');
  const threatTypes = [
    'INTRUSION_DETECTED',
    'PORT_SCAN',
    'BRUTE_FORCE',
    'DNS_QUERY',
    'MALWARE_SIGNATURE',
    'SQL_INJECTION',
    'XSS_ATTEMPT',
    'DDOS_ATTACK',
    'PHISHING_ATTEMPT',
    'ZERO_DAY_EXPLOIT'
  ];

  const severities = ['critical', 'high', 'medium', 'low'];
  const severityLabels = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW'
  };

  function generateRandomIP() {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(Math.floor(Math.random() * 256));
    }
    return segments.join('.');
  }

  function generateThreatEntry() {
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const source = generateRandomIP();
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const entry = document.createElement('div');
    entry.className = 'threat-entry incoming';
    entry.innerHTML = `
      <span class="threat-time">${timeStr}</span>
      <span class="threat-type">${type}</span>
      <span class="threat-source">${source}</span>
      <span class="threat-severity ${severity}">${severityLabels[severity]}</span>
    `;
    
    threatFeed.insertBefore(entry, threatFeed.firstChild);
    
    // Remove old entries
    while (threatFeed.children.length > 20) {
      threatFeed.removeChild(threatFeed.lastChild);
    }

    // Update stats
    const threatsBlocked = document.getElementById('threats-blocked');
    const currentCount = parseInt(threatsBlocked.textContent.replace(/,/g, ''));
    threatsBlocked.textContent = (currentCount + 1).toLocaleString();
  }

  // Generate initial threats
  for (let i = 0; i < 5; i++) {
    setTimeout(() => generateThreatEntry(), i * 500);
  }

  // Continue generating threats
  setInterval(generateThreatEntry, 3000);

  // ===================== VULNERABILITY SEVERITY BARS =====================
  // Animate severity bars on scroll
  const severityBars = document.querySelectorAll('.severity-fill');
  
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };

  const severityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.width;
        entry.target.style.transition = 'width 1.5s ease';
      }
    });
  }, observerOptions);

  severityBars.forEach(bar => {
    severityObserver.observe(bar);
  });

  // ===================== ENCRYPTED MESSAGE =====================
  const decryptBtn = document.getElementById('decryptBtn');
  const resetBtn = document.getElementById('resetBtn');
  const decodedMsg = document.getElementById('decodedMsg');
  const encryptedMsg = document.getElementById('encryptedMsg');

  const secretMessages = [
    'THE TRUTH IS OUT THERE',
    'TRUST NO ONE',
    'ACCESS GRANTED',
    'SYSTEM COMPROMISED',
    'FOLLOW THE WHITE RABBIT',
    'WAKE UP, NEO',
    'NOTHING IS AS IT SEEMS',
    'THEY ARE WATCHING',
    'DENY EVERYTHING',
    'ADMINISTRATOR ACCESS'
  ];

  let currentMessage = '';
  let isDecrypted = false;

  function getRandomMessage() {
    return secretMessages[Math.floor(Math.random() * secretMessages.length)];
  }

  function hexEncode(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16).toUpperCase() + ' ';
    }
    return hex.trim();
  }

  function updateEncryptedMessage() {
    currentMessage = getRandomMessage();
    const hexStr = hexEncode(currentMessage);
    encryptedMsg.querySelector('.cipher-text').textContent = hexStr;
  }

  decryptBtn.addEventListener('click', () => {
    if (isDecrypted) return;
    
    isDecrypted = true;
    decodedMsg.innerHTML = '';
    
    // Animated decryption effect
    let revealIndex = 0;
    const decryptedText = currentMessage;
    
    const revealInterval = setInterval(() => {
      if (revealIndex <= decryptedText.length) {
        const revealStr = decryptedText.substring(0, revealIndex);
        const remaining = decryptedText.substring(revealIndex);
        // Scramble remaining characters
        const scrambled = remaining.split('').map(() => {
          return String.fromCharCode(Math.floor(Math.random() * 94) + 33);
        }).join('');
        
        decodedMsg.innerHTML = `<span class="decoded-text">${revealStr}</span><span style="color: #005533;">${scrambled}</span>`;
        revealIndex++;
      } else {
        clearInterval(revealInterval);
        decodedMsg.innerHTML = `<span class="decoded-text">${decryptedText}</span>`;
      }
    }, 50);
  });

  resetBtn.addEventListener('click', () => {
    isDecrypted = false;
    updateEncryptedMessage();
    decodedMsg.innerHTML = '<span class="decoded-placeholder">AWAITING_DECRYPTION...</span>';
  });

  // Initialize encrypted message
  updateEncryptedMessage();

  // ===================== AUDIT LOG =====================
  const auditLog = document.getElementById('auditLog');
  const logLevels = ['INFO', 'WARN', 'ERROR', 'CRIT'];
  const logMessages = [
    'System integrity check passed',
    'Unusual outbound traffic detected on port 4444',
    'Failed SSH authentication attempt from ',
    'Certificate rotation completed successfully',
    'IDS signature update: new signatures installed',
    'Firewall rule set updated',
    'DNS cache poisoning attempt detected',
    'SSL/TLS handshake failure on port 443',
    'Database backup completed successfully',
    'User privilege escalation detected',
    'Malicious payload blocked by WAF',
    'API rate limit exceeded for endpoint /api/query',
    'New device fingerprint registered',
    'Suspicious PowerShell execution detected',
    'VPN tunnel established with remote node'
  ];

  function generateLogEntry() {
    const now = new Date();
    const timestamp = `[${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    let message = logMessages[Math.floor(Math.random() * logMessages.length)];
    
    if (message.includes('Failed SSH')) {
      message += generateRandomIP();
    }
    if (message.includes('new signatures')) {
      message = message.replace('new', String(Math.floor(Math.random() * 20) + 1));
    }

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <span class="log-timestamp">${timestamp}</span>
      <span class="log-level ${level.toLowerCase()}">${level}</span>
      <span class="log-message">${message}</span>
    `;

    auditLog.insertBefore(entry, auditLog.firstChild);

    // Remove old entries
    while (auditLog.children.length > 30) {
      auditLog.removeChild(auditLog.lastChild);
    }

    // Auto-scroll to top
    auditLog.scrollTop = 0;
  }

  // Generate initial log entries
  for (let i = 0; i < 5; i++) {
    setTimeout(() => generateLogEntry(), i * 1000);
  }

  // Continue generating logs
  setInterval(generateLogEntry, 4000);

  // ===================== NETWORK TOPOLOGY =====================
  const networkMap = document.getElementById('networkMap');
  const nodes = document.querySelectorAll('.node');
  const dataFlow = document.getElementById('dataFlow');

  // Animate data packets flowing between nodes
  function createDataPacket() {
    const packet = document.createElement('div');
    packet.style.cssText = `
      position: absolute;
      width: 6px;
      height: 6px;
      background: var(--neon-green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--neon-green);
      pointer-events: none;
      z-index: 3;
    `;
    return packet;
  }

  function animatePacket() {
    const packet = createDataPacket();
    networkMap.appendChild(packet);

    // Random start and end positions within the map
    const startX = Math.random() * 80 + 10;
    const startY = Math.random() * 80 + 10;
    const endX = Math.random() * 80 + 10;
    const endY = Math.random() * 80 + 10;

    packet.style.left = startX + '%';
    packet.style.top = startY + '%';

    const duration = 1000 + Math.random() * 2000;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      packet.style.left = currentX + '%';
      packet.style.top = currentY + '%';

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        packet.remove();
      }
    }

    requestAnimationFrame(animate);
  }

  // Generate data packets periodically
  setInterval(animatePacket, 500);

  // Node connection lines (SVG-like using CSS)
  function updateConnectionLines() {
    const existingLines = document.querySelectorAll('.connection-line-dynamic');
    existingLines.forEach(line => line.remove());

    const mainNode = document.querySelector('.main-node');
    if (!mainNode) return;

    const mainRect = mainNode.getBoundingClientRect();
    const mapRect = networkMap.getBoundingClientRect();
    const mainCenterX = mainRect.left - mapRect.left + mainRect.width / 2;
    const mainCenterY = mainRect.top - mapRect.top + mainRect.height / 2;

    document.querySelectorAll('.secondary-node, .leaf-node').forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenterX = nodeRect.left - mapRect.left + nodeRect.width / 2;
      const nodeCenterY = nodeRect.top - mapRect.top + nodeRect.height / 2;

      const line = document.createElement('div');
      line.className = 'connection-line-dynamic';
      
      const dx = nodeCenterX - mainCenterX;
      const dy = nodeCenterY - mainCenterY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      line.style.cssText = `
        position: absolute;
        left: ${mainCenterX}px;
        top: ${mainCenterY}px;
        width: ${length}px;
        height: 1px;
        background: linear-gradient(90deg, 
          rgba(0, 255, 65, 0.3), 
          rgba(0, 255, 65, 0.1)
        );
        transform-origin: 0 0;
        transform: rotate(${angle}deg);
        pointer-events: none;
        z-index: 1;
      `;

      networkMap.appendChild(line);
    });
  }

  // Update connection lines on resize
  window.addEventListener('resize', updateConnectionLines);
  setTimeout(updateConnectionLines, 100);

  // ===================== STAT COUNTER ANIMATION =====================
  const statValues = document.querySelectorAll('.stat-value');
  
  function animateCounters() {
    statValues.forEach(stat => {
      const targetText = stat.textContent;
      const isPercentage = targetText.includes('.');
      const target = parseFloat(targetText.replace(/,/g, ''));
      
      if (!isNaN(target)) {
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          if (isPercentage) {
            current = target * progress;
            stat.textContent = current.toFixed(2);
          } else {
            current = Math.floor(target * progress);
            stat.textContent = current.toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = targetText;
          }
        }

        requestAnimationFrame(updateCounter);
      }
    });
  }

  // Animate counters on load
  setTimeout(animateCounters, 500);

  // ===================== MOUSE TRAIL EFFECT =====================
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 1px solid var(--neon-green);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transition: all 0.1s ease;
    opacity: 0.3;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
  `;
  document.body.appendChild(trail);

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.style.left = (mouseX - 10) + 'px';
    trail.style.top = (mouseY - 10) + 'px';
  });

  // ===================== KEYBOARD SOUND EFFECT (VISUAL ONLY) =====================
  document.addEventListener('keydown', (e) => {
    const key = document.createElement('span');
    key.textContent = e.key.toUpperCase();
    key.style.cssText = `
      position: fixed;
      font-family: var(--font-display);
      font-size: 0.8rem;
      color: var(--neon-green);
      pointer-events: none;
      z-index: 9996;
      opacity: 0.5;
      animation: keyFade 0.5s ease forwards;
    `;
    
    key.style.left = (Math.random() * 80 + 10) + '%';
    key.style.top = (Math.random() * 60 + 20) + '%';
    
    document.body.appendChild(key);
    
    setTimeout(() => key.remove(), 500);
  });

  // Add keyFade animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes keyFade {
      0% { opacity: 0.5; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);

  // ===================== SYSTEM STATUS INDICATOR =====================
  const systemStatus = document.getElementById('systemStatus');
  const statuses = [
    { text: '[SYSTEM: SECURE]', class: 'secure' },
    { text: '[SYSTEM: MONITORING]', class: 'secure' },
    { text: '[SYSTEM: HARDENED]', class: 'secure' },
    { text: '[SYSTEM: STEALTH]', class: 'secure' }
  ];

  function updateSystemStatus() {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    systemStatus.textContent = status.text;
    systemStatus.className = `system-status ${status.class}`;
  }

  setInterval(updateSystemStatus, 8000);

  console.log('%cCYBERWATCH SECURITY RESEARCH DIVISION', 
    'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
  console.log('%cSYSTEM INITIALIZED // ALL PROTOCOLS ACTIVE', 
    'color: #00ffff; font-size: 12px;');
});
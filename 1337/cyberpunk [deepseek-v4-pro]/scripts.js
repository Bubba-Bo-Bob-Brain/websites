(function() {
  const canvas = document.getElementById('matrixRain');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let columns;
    let drops;
    const fontSize = 14;
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = characters.split('');

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height / fontSize);
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 12, 15, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#c5ff3d';
      ctx.font = fontSize + 'px "Share Tech Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setInterval(draw, 45);
  }

  const timeDisplay = document.getElementById('liveTime');
  function updateTime() {
    if (!timeDisplay) return;
    const now = new Date();
    const formatted = now.toTimeString().split(' ')[0] + ' GMT';
    timeDisplay.textContent = formatted;
  }
  updateTime();
  setInterval(updateTime, 1000);

  const navItems = document.querySelectorAll('.nav-item');
  const panels = {
    terminal: document.getElementById('terminal'),
    grid: document.getElementById('grid'),
    logs: document.getElementById('logs'),
    access: document.getElementById('access')
  };

  function switchPanel(targetId) {
    Object.values(panels).forEach(panel => {
      if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('active-panel');
      }
    });
    navItems.forEach(item => item.classList.remove('active'));

    const activePanel = panels[targetId];
    if (activePanel) {
      activePanel.classList.remove('hidden');
      activePanel.classList.add('active-panel');
    }
    const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (activeNav) activeNav.classList.add('active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      if (target) switchPanel(target);
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const nodeCards = document.querySelectorAll('.node-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      nodeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (terminalInput && terminalOutput) {
    const commands = {
      help: () => {
        return [
          'AVAILABLE COMMANDS:',
          '  help        - Show this message',
          '  status      - System status overview',
          '  scan        - Run network scan (simulated)',
          '  clear       - Clear terminal',
          '  whoami      - Display user identity',
          '  date        - Show current date/time',
          '  hack        - Initiate hack sequence (just kidding)'
        ];
      },
      status: () => {
        return [
          'SYSTEM STATUS:',
          '  CPU: 23% | MEM: 7.2/16GB | DISK: 67%',
          '  UPLINK: 1.2 Gbps | LATENCY: 12ms',
          '  FIREWALL: ACTIVE | INTRUSIONS: 0'
        ];
      },
      scan: () => {
        return [
          'SCANNING...',
          '  192.168.1.1  [OPEN PORTS: 22, 80, 443]',
          '  192.168.1.105 [OPEN PORTS: 8080]',
          '  10.0.0.5     [FILTERED]',
          'SCAN COMPLETE.'
        ];
      },
      clear: () => {
        terminalOutput.innerHTML = '';
        return [];
      },
      whoami: () => {
        return ['root@neon_shadow'];
      },
      date: () => {
        return [new Date().toString()];
      },
      hack: () => {
        return [
          'INITIATING HACK SEQUENCE...',
          'BYPASSING FIREWALL... ████████ 100%',
          'ACCESS GRANTED. (just a simulation)'
        ];
      }
    };

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        const outputLine = document.createElement('p');
        outputLine.className = 'line';
        outputLine.innerHTML = `<span class="prompt" style="margin-right:0.5rem;">root@neon:~#</span> ${cmd}`;
        terminalOutput.appendChild(outputLine);

        if (commands[cmd]) {
          const result = commands[cmd]();
          result.forEach(text => {
            const resLine = document.createElement('p');
            resLine.className = 'line';
            resLine.textContent = text;
            terminalOutput.appendChild(resLine);
          });
        } else if (cmd !== '') {
          const errLine = document.createElement('p');
          errLine.className = 'line';
          errLine.style.color = '#ff3a3a';
          errLine.textContent = `command not found: ${cmd}`;
          terminalOutput.appendChild(errLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }

  const logStream = document.getElementById('logStream');
  if (logStream) {
    const logMessages = [
      'CONNECTION FROM 45.33.32.156 ESTABLISHED',
      'PACKET FILTER RULE UPDATED',
      'TLS HANDSHAKE WITH node.cyber.net',
      'INTRUSION DETECTED FROM 78.12.99.4',
      'AUTHENTICATION SUCCESS FOR USER ghost',
      'DATA STREAM 0x4F2A ACTIVE',
      'FIREWALL LOG ROTATION COMPLETE'
    ];

    function addLogEntry() {
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const entry = document.createElement('p');
      entry.className = 'log-entry';
      entry.innerHTML = `<span class="timestamp">[${timeStr}]</span> ${randomMsg}`;
      logStream.appendChild(entry);
      if (logStream.children.length > 25) {
        logStream.removeChild(logStream.firstChild);
      }
      logStream.scrollTop = logStream.scrollHeight;
    }

    setInterval(addLogEntry, 1800);
    for (let i = 0; i < 5; i++) {
      setTimeout(addLogEntry, i * 200);
    }
  }

  const authButton = document.getElementById('authenticateBtn');
  if (authButton) {
    authButton.addEventListener('click', () => {
      const keyInput = document.getElementById('accessKey');
      const codeInput = document.getElementById('accessCode');
      if (keyInput && codeInput) {
        if (keyInput.value.trim() === '' || codeInput.value.trim() === '') {
          alert('ACCESS DENIED: Credentials required.');
        } else {
          alert('AUTHENTICATION SUCCESSFUL (simulation). Welcome, operative.');
          keyInput.value = '';
          codeInput.value = '';
        }
      }
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .glitch-text {
      animation: glitch 0.3s infinite;
    }
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -1px); }
      60% { transform: translate(-1px, 1px); }
      80% { transform: translate(1px, -2px); }
      100% { transform: translate(0); }
    }
  `;
  document.head.appendChild(style);
})();
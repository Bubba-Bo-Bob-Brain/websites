document.addEventListener('DOMContentLoaded', () => {

  // === STATE ===
  const state = {
    powered: true,
    tapeOnline: true,
    amberMode: true,
    selectedFile: 'PROMETHEUS.KNL',
    currentPath: '/',
    operationMode: 'COPY',
    tapeActive: false,
    transferProgress: 0,
    clockTime: new Date(),
  };

  // === DOM REFS ===
  const refs = {
    crtScreen: document.getElementById('crtScreen'),
    powerToggle: document.getElementById('powerToggle'),
    tapeToggle: document.getElementById('tapeToggle'),
    amberToggle: document.getElementById('amberToggle'),
    cpuFill: document.getElementById('cpuFill'),
    memFill: document.getElementById('memFill'),
    diskFill: document.getElementById('diskFill'),
    reelLeft: document.getElementById('reelLeft'),
    reelRight: document.getElementById('reelRight'),
    leftTape: document.getElementById('leftTape'),
    rightTape: document.getElementById('rightTape'),
    tapeOperation: document.getElementById('tapeOperation'),
    tapeProgress: document.getElementById('tapeProgress'),
    rotaryDial: document.getElementById('rotaryDial'),
    dialPointer: document.querySelector('.dial-pointer'),
    dialValues: document.querySelectorAll('.dial-value'),
    progressFill: document.getElementById('progressFill'),
    progressPercent: document.getElementById('progressPercent'),
    btnLoad: document.getElementById('btnLoad'),
    btnRewind: document.getElementById('btnRewind'),
    btnTransfer: document.getElementById('btnTransfer'),
    btnEject: document.getElementById('btnEject'),
    consoleOutput: document.getElementById('consoleOutput'),
    consoleInput: document.getElementById('consoleInput'),
    consolePrompt: document.querySelector('.console-prompt'),
    clockDisplay: document.getElementById('clockDisplay'),
    selectedFileDisplay: document.getElementById('selectedFileDisplay'),
    tickerTape: document.getElementById('tickerTape'),
    fileItems: document.querySelectorAll('.file-item'),
    treeItems: document.querySelectorAll('.tree-item'),
  };

  // === CLOCK ===
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    refs.clockDisplay.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // === POWER TOGGLE ===
  refs.powerToggle.addEventListener('click', () => {
    state.powered = !state.powered;
    refs.powerToggle.dataset.state = state.powered ? 'on' : 'off';
    refs.crtScreen.style.opacity = state.powered ? '1' : '0.05';
    addConsoleLine(
      state.powered ? 'SYSTEM POWER ON — ALL SUBSYSTEMS NOMINAL' : 'SYSTEM POWER OFF — STANDBY MODE',
      state.powered ? 'success' : 'system'
    );
  });

  // === TAPE TOGGLE ===
  refs.tapeToggle.addEventListener('click', () => {
    state.tapeOnline = !state.tapeOnline;
    refs.tapeToggle.dataset.state = state.tapeOnline ? 'on' : 'off';
    addConsoleLine(
      state.tapeOnline ? 'TAPE UNIT ONLINE — MAGNETIC HEAD READY' : 'TAPE UNIT OFFLINE — DISCONNECTED',
      'system'
    );
  });

  // === AMBER TOGGLE ===
  refs.amberToggle.addEventListener('click', () => {
    state.amberMode = !state.amberMode;
    refs.amberToggle.dataset.state = state.amberMode ? 'on' : 'off';
    const root = document.documentElement;
    if (state.amberMode) {
      root.style.setProperty('--text-primary', '#e8a020');
      root.style.setProperty('--amber', '#e8a020');
      root.style.setProperty('--amber-bright', '#ffc840');
      root.style.setProperty('--amber-glow', 'rgba(232, 160, 32, 0.6)');
      root.style.setProperty('--amber-glow-strong', 'rgba(232, 160, 32, 0.9)');
    } else {
      root.style.setProperty('--text-primary', '#40c060');
      root.style.setProperty('--amber', '#40c060');
      root.style.setProperty('--amber-bright', '#80e0a0');
      root.style.setProperty('--amber-glow', 'rgba(64, 192, 96, 0.6)');
      root.style.setProperty('--amber-glow-strong', 'rgba(64, 192, 96, 0.9)');
    }
    addConsoleLine(
      state.amberMode ? 'DISPLAY MODE: AMBER PHOSPHOR' : 'DISPLAY MODE: GREEN PHOSPHOR',
      'system'
    );
  });

  // === ANALOG METERS ANIMATION ===
  function animateMeters() {
    const cpu = 20 + Math.random() * 40;
    const mem = 30 + Math.random() * 30;
    const disk = 15 + Math.random() * 25;
    refs.cpuFill.style.width = cpu + '%';
    refs.memFill.style.width = mem + '%';
    refs.diskFill.style.width = disk + '%';
  }
  setInterval(animateMeters, 2000);
  animateMeters();

  // === ROTARY DIAL ===
  let dialAngle = 0;
  const modes = ['COPY', 'MOVE', 'BACKUP', 'ARCHIVE'];
  const modeAngles = [0, 90, 180, 270];

  refs.rotaryDial.addEventListener('click', () => {
    const idx = (modes.indexOf(state.operationMode) + 1) % modes.length;
    state.operationMode = modes[idx];
    dialAngle = modeAngles[idx];
    refs.dialPointer.style.transform =
      `translate(-50%, -100%) rotate(${dialAngle}deg)`;
    refs.dialValues.forEach(el => {
      el.classList.toggle('active', el.dataset.mode === state.operationMode);
    });
    addConsoleLine(`OPERATION MODE: ${state.operationMode}`, 'system');
  });

  // Set initial active dial value
  refs.dialValues.forEach(el => {
    el.classList.toggle('active', el.dataset.mode === state.operationMode);
  });

  // === FILE SELECTION ===
  refs.fileItems.forEach(item => {
    item.addEventListener('click', () => {
      refs.fileItems.forEach(f => f.classList.remove('selected'));
      item.classList.add('selected');
      state.selectedFile = item.dataset.file;
      refs.selectedFileDisplay.textContent = state.selectedFile;
      addConsoleLine(`SELECTED: ${state.selectedFile} — SIZE: ${item.querySelector('.file-size').textContent}`, '');
    });
  });

  // === TREE NAVIGATION ===
  refs.treeItems.forEach(item => {
    item.addEventListener('click', () => {
      const children = item.nextElementSibling;
      if (children && children.classList.contains('tree-children')) {
        const isExpanded = item.classList.contains('expanded');
        item.classList.toggle('expanded');
        item.querySelector('.tree-toggle').textContent = isExpanded ? '▸' : '▾';
        children.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });

  // === TAPE OPERATIONS ===
  function setTapeStatus(text) {
    refs.tapeOperation.textContent = text;
  }

  function spinReels(spinning) {
    if (spinning) {
      refs.reelLeft.classList.add('tape-spinning');
      refs.reelRight.classList.add('tape-spinning');
    } else {
      refs.reelLeft.classList.remove('tape-spinning');
      refs.reelRight.classList.remove('tape-spinning');
    }
  }

  function animateTransfer() {
    if (!state.tapeOnline) {
      addConsoleLine('ERROR: TAPE UNIT OFFLINE', 'system');
      return;
    }
    state.transferProgress = 0;
    refs.progressFill.style.width = '0%';
    refs.progressPercent.textContent = '0%';
    setTapeStatus('TRANSFERING...');
    spinReels(true);

    const interval = setInterval(() => {
      state.transferProgress += Math.random() * 8 + 2;
      if (state.transferProgress >= 100) {
        state.transferProgress = 100;
        clearInterval(interval);
        refs.progressFill.style.width = '100%';
        refs.progressPercent.textContent = '100%';
        setTapeStatus('COMPLETE');
        spinReels(false);
        addConsoleLine(
          `TRANSFER COMPLETE — ${state.selectedFile} — ${state.operationMode} MODE`,
          'success'
        );
        setTimeout(() => {
          setTapeStatus('READY');
          refs.progressPercent.textContent = '0%';
        }, 3000);
      } else {
        refs.progressFill.style.width = state.transferProgress + '%';
        refs.progressPercent.textContent = Math.floor(state.transferProgress) + '%';
      }
    }, 150);
  }

  function animateRewind() {
    if (!state.tapeOnline) {
      addConsoleLine('ERROR: TAPE UNIT OFFLINE', 'system');
      return;
    }
    setTapeStatus('REWINDING...');
    refs.progressFill.style.width = '0%';
    refs.progressPercent.textContent = '0%';
    spinReels(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        refs.progressFill.style.width = '100%';
        refs.progressPercent.textContent = '100%';
        setTapeStatus('READY');
        spinReels(false);
        addConsoleLine('TAPE REWOUND — READY FOR NEXT OPERATION', '');
      } else {
        refs.progressFill.style.width = progress + '%';
        refs.progressPercent.textContent = Math.floor(progress) + '%';
      }
    }, 100);
  }

  refs.btnLoad.addEventListener('click', () => {
    addConsoleLine(`LOADING ${state.selectedFile} FROM TAPE...`, 'system');
    setTapeStatus('LOADING...');
    spinReels(true);
    setTimeout(() => {
      spinReels(false);
      setTapeStatus('READY');
      addConsoleLine(`${state.selectedFile} LOADED — 48.2K BYTES`, 'success');
    }, 2000);
  });

  refs.btnRewind.addEventListener('click', animateRewind);

  refs.btnTransfer.addEventListener('click', animateTransfer);

  refs.btnEject.addEventListener('click', () => {
    if (!state.tapeOnline) {
      addConsoleLine('ERROR: TAPE UNIT OFFLINE', 'system');
      return;
    }
    setTapeStatus('EJECTING...');
    addConsoleLine('EJECTING TAPE — PLEASE REMOVE CASSETTE', 'system');
    setTimeout(() => {
      setTapeStatus('READY');
      addConsoleLine('TAPE EJECTED — UNIT READY', '');
    }, 1500);
  });

  // === CONSOLE ===
  function addConsoleLine(message, type = '') {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = `<span class="console-time">${h}:${m}:${s}</span><span class="console-msg">${message}</span>`;
    refs.consoleOutput.appendChild(line);
    refs.consoleOutput.scrollTop = refs.consoleOutput.scrollHeight;
  }

  refs.consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = refs.consoleInput.value.trim().toUpperCase();
      refs.consoleInput.value = '';
      if (!cmd) return;

      addConsoleLine(`C:\\> ${cmd}`, '');

      const responses = {
        'HELP': 'AVAILABLE COMMANDS: DIR, COPY, MOVE, DELETE, TYPE, INFO, STATUS, CLEAR, DATE, VER',
        'DIR': 'DIRECTORY OF /USR:\\n  DATA       <DIR>\\n  LOGS       <DIR>\\n  PROMETHEUS.KNL\\n  TERMINAL.CAS\\n  PATCH.NEU',
        'COPY': `COPY ${state.selectedFile} TO TAPE — MODE: ${state.operationMode}`,
        'MOVE': `MOVE ${state.selectedFile} — OPERATION QUEUED`,
        'DELETE': `DELETE ${state.selectedFile} — CONFIRM? (Y/N)`,
        'TYPE': `CONTENTS OF ${state.selectedFile}:\\n  ; PROMETHEUS KERNEL v3.7\\n  ; ANALOG COMPUTING ENVIRONMENT\\n  ; BUILD 1977.03.14\\n  ...`,
        'INFO': `${state.selectedFile} — SIZE: 48.2K — DATE: 03-14-77 — ATTR: R/W`,
        'STATUS': 'SYSTEM STATUS: OPERATIONAL\\nTAPE: ONLINE\\nCPU: NOMINAL\\nMEMORY: 65536K\\nDISK: 45.8K FREE',
        'DATE': `CURRENT DATE: ${new Date().toLocaleDateString()}`,
        'VER': 'PROMETHEUS OS v3.7 — ANALOG COMPUTING ENVIRONMENT\\nBUILD 1977.03.14 — (C) PROMETHEUS DIV.',
        'CLEAR': 'CLEAR',
      };

      if (cmd === 'CLEAR') {
        refs.consoleOutput.innerHTML = '';
      } else {
        const response = responses[cmd] || `UNKNOWN COMMAND: ${cmd} — TYPE HELP FOR AVAILABLE COMMANDS`;
        addConsoleLine(response, cmd === 'STATUS' || cmd === 'VER' ? 'system' : '');
      }
    }
  });

  // === TICKER TAPE ===
  const tickerMessages = [
    'PROMETHEUS OS v3.7 — ANALOG COMPUTING ENVIRONMENT',
    'BUILD 1977.03.14 — ALL SYSTEMS NOMINAL',
    'TAPE UNIT: MAGNETIC REEL-TO-REEL TRANSFER SYSTEM',
    'MEMORY: 65536K CORE — CPU: PROMETHEUS 8008',
    'PHOSPHOR DISPLAY: AMBER/WARM — CRT MONITOR v2',
  ];

  let tickerIndex = 0;
  function cycleTicker() {
    const span = refs.tickerTape.querySelector('span');
    if (span) {
      span.style.animation = 'none';
      span.textContent = tickerMessages[tickerIndex];
      void span.offsetWidth;
      span.style.animation = `ticker-scroll ${15 + Math.random() * 10}s linear infinite`;
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;
    }
  }
  setInterval(cycleTicker, 8000);
  cycleTicker();

  // === CRT POWER-ON EFFECT ===
  if (state.powered) {
    refs.crtScreen.style.opacity = '0';
    setTimeout(() => {
      refs.crtScreen.style.transition = 'opacity 1.5s ease';
      refs.crtScreen.style.opacity = '1';
    }, 100);
  }

  // === AMBIENT BACKGROUND NOISE ===
  function createNoise() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(1, 1);
    const offset = Math.random() * 255;
    imageData.data[0] = offset;
    imageData.data[1] = offset;
    imageData.data[2] = offset;
    imageData.data[3] = 8;
    ctx.putImageData(imageData, 0, 0);
    const url = canvas.toDataURL();
    document.body.style.backgroundImage = `url(${url})`;
  }
  createNoise();

  // === INITIAL CONSOLE WELCOME ===
  setTimeout(() => {
    addConsoleLine('WELCOME TO PROMETHEUS OS v3.7', 'system');
    addConsoleLine('TYPE "HELP" FOR AVAILABLE COMMANDS', '');
  }, 2500);

  // === PHOSPHOR TEXT GLOW PULSE ===
  setInterval(() => {
    const glowElements = document.querySelectorAll('.title-glow, .console-prompt, .status-icon');
    glowElements.forEach(el => {
      el.style.textShadow =
        `0 0 ${4 + Math.random() * 4}px var(--amber-glow), 0 0 ${8 + Math.random() * 8}px rgba(232,160,32,0.2)`;
    });
  }, 3000);

  // === TAPESPIN REEL SCHEDULED ANIMATION ===
  function scheduledReelIdle() {
    if (state.tapeOnline && !state.tapeActive) {
      refs.reelLeft.style.animation = 'reel-idle 3s ease-in-out infinite';
      refs.reelRight.style.animation = 'reel-idle-reverse 3s ease-in-out infinite';
    }
  }

  // === CRT FLICKER ===
  setInterval(() => {
    if (state.powered && Math.random() > 0.92) {
      refs.crtScreen.style.filter = 'brightness(0.92)';
      setTimeout(() => {
        refs.crtScreen.style.filter = 'brightness(1)';
      }, 50);
    }
  }, 2000);

  // === KEYBOARD SHORTCUTS ===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      addConsoleLine('KEYBOARD SHORTCUTS: F1=HELP F2=DIR F3=STATUS F4=CLEAR', 'system');
    }
    if (e.key === 'F2') {
      e.preventDefault();
      addConsoleLine('DIRECTORY OF /USR:\\n  DATA       <DIR>\\n  LOGS       <DIR>\\n  PROMETHEUS.KNL\\n  TERMINAL.CAS', '');
    }
    if (e.key === 'F3') {
      e.preventDefault();
      addConsoleLine('SYSTEM STATUS: OPERATIONAL — ALL SUBSYSTEMS NOMINAL', 'system');
    }
    if (e.key === 'F4') {
      e.preventDefault();
      refs.consoleOutput.innerHTML = '';
    }
  });

  // === SELECTION NAVIGATION ===
  let selectedIndex = 0;
  refs.consoleInput.addEventListener('focus', () => {
    refs.consoleInput.parentElement.style.background = 'rgba(232,160,32,0.05)';
  });
  refs.consoleInput.addEventListener('blur', () => {
    refs.consoleInput.parentElement.style.background = 'rgba(0,0,0,0.3)';
  });

  // Focus console on load
  setTimeout(() => refs.consoleInput.focus(), 3000);

});
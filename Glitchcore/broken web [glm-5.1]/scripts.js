const State = {
  currentLayer: null,
  depth: 0,
  loadingComplete: false,
  errorIndex: 0,
  terminalDir: '/home/admin',
  commandHistory: [],
  historyIndex: -1,
  glitchInterval: null,
  statusInterval: null,
  poemRevealed: false,
  terminalFs: {
    '/': {
      type: 'dir',
      children: ['home', 'var', 'etc', 'archive']
    },
    '/home': {
      type: 'dir',
      children: ['admin']
    },
    '/home/admin': {
      type: 'dir',
      children: ['documents', '.hidden']
    },
    '/home/admin/documents': {
      type: 'dir',
      children: ['readme.txt', 'migration_notes.txt', 'incident_report_2003.txt']
    },
    '/home/admin/.hidden': {
      type: 'dir',
      children: ['index.html.bak']
    },
    '/home/admin/documents/readme.txt': {
      type: 'file',
      content: 'Welcome to the Meridian Systems internal documentation server.\n\nThis system is scheduled for decommission on December 31, 2003.\nAll data will be migrated to the new infrastructure.\n\nPlease ensure all critical files are backed up before the migration window.\n\n-- System Administrator'
    },
    '/home/admin/documents/migration_notes.txt': {
      type: 'file',
      content: 'MIGRATION NOTES - PHASE II\n==========================\n\nServer meridian-db-03 primary cluster migration initiated.\nEstimated downtime: 4-6 hours.\n\nIssues encountered:\n- Table corruption detected in user_records\n- Foreign key constraints failing on legacy schemas\n- Backup integrity verification: FAILED on sectors 7-A through 7-F\n\nThe original site files have been archived to /archive/site/original/\n\nNote: Some files may be irrecoverable due to disk degradation.\n\n[WARNING] Do not attempt to access the root archive without proper clearance.\n          The original index.html may still be intact.'
    },
    '/home/admin/documents/incident_report_2003.txt': {
      type: 'file',
      content: 'INCIDENT REPORT #IR-2003-0847\n=============================\nDate: 2003-11-19\nSeverity: CRITICAL\nStatus: UNRESOLVED\n\nDescription:\nAt approximately 03:14 UTC, the primary database cluster experienced\na cascading failure originating in sector 7-A. The corruption spread\nto 47 connected tables before the failover could engage.\n\nRoot cause analysis suggests disk degradation on the primary array.\nBackup systems did not engage correctly due to a misconfigured\nfailover path (see migration_notes.txt).\n\nThe system has been in a degraded state since. All customer-facing\nservices are returning errors.\n\nThe original site from 1997 appears to still exist somewhere in\nthe archive filesystem. It was never migrated. It may be the only\nclean data remaining on this server.\n\nI have hidden the path in the database. If you are reading this,\nyou have come far enough. Look deeper.\n\n-- J. Chen, Senior Systems Engineer'
    },
    '/home/admin/.hidden/index.html.bak': {
      type: 'file',
      content: '__HIDDEN_PAGE_TRIGGER__'
    },
    '/var': {
      type: 'dir',
      children: ['log']
    },
    '/var/log': {
      type: 'dir',
      children: ['system.log', 'error.log']
    },
    '/var/log/system.log': {
      type: 'file',
      content: '[2003-11-19 03:14:01] INFO: System health check initiated\n[2003-11-19 03:14:02] INFO: All services nominal\n[2003-11-19 03:14:07] WARN: Disk I/O latency exceeding threshold on /dev/sda1\n[2003-11-19 03:14:12] ERROR: Read fault on sector 7-A\n[2003-11-19 03:14:15] ERROR: Read fault on sector 7-B\n[2003-11-19 03:14:18] CRITICAL: Cascading disk failure detected\n[2003-11-19 03:14:22] CRITICAL: Primary database cluster unresponsive\n[2003-11-19 03:14:30] ERROR: Failover system did not engage - misconfigured path\n[2003-11-19 03:14:45] ALERT: System entering degraded mode\n[2003-11-19 03:15:02] ERROR: Connection pool exhausted\n[2003-11-19 03:15:30] WARN: Memory allocation failures increasing\n[2003-11-19 03:16:00] ERROR: Filesystem corruption detected\n[2003-11-19 03:16:30] CRITICAL: Service mesh collapsing\n[2003-11-19 03:17:00] ????????????????????????????????????\n[2003-11-19 03:17:??] ????????????????????????????????????\n[2003-11-19 ???:??:??] ██████████████████████████████████'
    },
    '/var/log/error.log': {
      type: 'file',
      content: '████████████████████████████████████████████████████████████████\nERROR LOG CORRUPTED - CANNOT READ\n████████████████████████████████████████████████████████████████\n????????????????????????????????????????????????????????????????\nREMAINING ENTRIES UNRECOVERABLE\n????????????????????????????????????????????????????????????????'
    },
    '/etc': {
      type: 'dir',
      children: ['config']
    },
    '/etc/config': {
      type: 'file',
      content: '# Meridian Systems Server Configuration\n# Last modified: 2003-11-19 03:14:07\n\nserver.name=MERIDIAN-WS-03\nserver.port=80\nserver.admin=root@meridian-systems.net\n\n# Database configuration\ndb.host=meridian-db-03.primary\ndb.port=5432\ndb.name=MERIDIAN_SYSTEMS_DB\ndb.pool_size=50\ndb.timeout=30000\n\n# ????????????????????????????????????????????\n# ????????????????????????????????????????????\n# WARNING: Configuration integrity compromised\n# ????????????????????????????????????????????'
    },
    '/archive': {
      type: 'dir',
      children: ['site']
    },
    '/archive/site': {
      type: 'dir',
      children: ['original']
    },
    '/archive/site/original': {
      type: 'dir',
      children: ['index.html']
    },
    '/archive/site/original/index.html': {
      type: 'file',
      content: '__HIDDEN_PAGE_TRIGGER__'
    }
  }
};

const LoadingMessages = [
  'Connecting to meridian-systems.net...',
  'Resolving DNS...',
  'Establishing secure connection',
  'Authenticating credentials...',
  'Loading system modules...',
  'Verifying filesystem integrity...',
  'Initializing database connection pool...',
  'Synchronizing cluster nodes...',
  'Checking backup systems...',
  'Applying security patches...',
  'Loading user preferences...',
  'Rebuilding search index...',
  'Compiling page templates...'
];

const LoadingGlitches = [
  '',
  '',
  '',
  '',
  '',
  'WARN: Disk I/O latency spike on /dev/sda1',
  'WARN: Retry count exceeded on sector 7-A',
  'ERROR: Read fault on primary array',
  '',
  'ERROR: Connection refused - failover not responding',
  '',
  'CRITICAL: Data integrity check failed',
  '',
  'ERROR: Service mesh degrading',
  '',
  '',
  'ALERT: Multiple system failures detected',
  '',
  'WARN: Memory allocation under pressure'
];

function init() {
  startLoadingSequence();
  setupEventListeners();
  startGlitchCycle();
}

function startLoadingSequence() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingText = document.getElementById('loading-text');
  const loadingSub = document.getElementById('loading-sub');
  const loadingGlitchText = document.getElementById('loading-glitch-text');

  let progress = 0;
  let messageIndex = 0;
  let glitchIndex = 0;
  let phase = 'normal';

  const loadingInterval = setInterval(() => {
    if (phase === 'normal') {
      if (progress < 30) {
        progress += Math.random() * 3 + 1;
      } else if (progress < 47) {
        progress += Math.random() * 0.5;
        if (progress > 38) {
          phase = 'stuck1';
        }
      } else if (progress < 50) {
        progress += Math.random() * 0.3;
      } else if (progress < 73) {
        progress += Math.random() * 0.6;
        if (progress > 63) {
          phase = 'stuck2';
        }
      } else if (progress < 87) {
        progress += Math.random() * 0.4;
        if (progress > 80) {
          phase = 'stuck3';
        }
      } else if (progress < 99) {
        progress += Math.random() * 0.05;
      }
    } else if (phase === 'stuck1') {
      if (Math.random() < 0.03) {
        progress += 0.1;
      }
      if (progress > 44 && Math.random() < 0.01) {
        phase = 'jump';
      }
    } else if (phase === 'stuck2') {
      if (Math.random() < 0.02) {
        progress += 0.05;
      }
      if (progress > 70 && Math.random() < 0.008) {
        phase = 'backward';
      }
    } else if (phase === 'stuck3') {
      if (Math.random() < 0.01) {
        progress += 0.02;
      }
      if (progress > 86 && Math.random() < 0.005) {
        phase = 'final-push';
      }
    } else if (phase === 'jump') {
      progress += 6;
      if (progress >= 50) {
        progress = 50;
        phase = 'normal';
      }
    } else if (phase === 'backward') {
      progress -= 2;
      if (progress <= 66) {
        phase = 'normal';
      }
    } else if (phase === 'final-push') {
      progress += 0.8;
      if (progress >= 99) {
        progress = 99;
        phase = 'almost';
      }
    } else if (phase === 'almost') {
      if (Math.random() < 0.003) {
        progress = 100;
        phase = 'done';
      }
    }

    if (progress >= 100) {
      progress = 100;
      phase = 'done';
    }

    loadingBarFill.style.width = progress + '%';
    loadingPercent.textContent = Math.floor(progress) + '%';

    if (Math.random() < 0.08 && messageIndex < LoadingMessages.length) {
      loadingText.textContent = LoadingMessages[messageIndex];
      messageIndex++;
    }

    if (Math.random() < 0.04 && glitchIndex < LoadingGlitches.length) {
      const glitch = LoadingGlitches[glitchIndex];
      loadingGlitchText.textContent = glitch;
      glitchIndex++;
    }

    if (progress > 60) {
      loadingSub.textContent = 'System response times may vary';
    }

    if (progress > 85) {
      loadingSub.textContent = 'Please wait...';
      loadingSub.style.color = 'var(--amber-bright)';
    }

    if (phase === 'done') {
      clearInterval(loadingInterval);
      loadingPercent.textContent = '100%';
      loadingText.textContent = 'Connection established.';
      loadingGlitchText.textContent = 'WARN: 47 integrity warnings suppressed';

      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          showLayer('layer-surface');
          document.getElementById('depth-indicator').classList.add('visible');
          startStatusDegradation();
        }, 800);
      }, 1200);
    }
  }, 120);
}

function setupEventListeners() {
  document.querySelectorAll('[data-dest]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = el.getAttribute('data-dest');
      navigateTo(dest);
    });
  });

  document.getElementById('db-secret-row').addEventListener('click', () => {
    navigateTo('layer-archive');
  });

  document.getElementById('return-surface').addEventListener('click', () => {
    navigateTo('layer-surface', true);
  });

  setupTerminal();
}

function navigateTo(dest, resetDepth) {
  if (dest === 'error-404' || dest === 'error-403' || dest === 'error-500') {
    if (State.currentLayer !== 'layer-errors') {
      State.errorIndex = 0;
      transitionToLayer('layer-errors');
      showSpecificError('error-404');
    } else {
      showSpecificError(dest);
    }
    return;
  }

  if (dest === 'error-bsod') {
    showSpecificError('error-bsod');
    return;
  }

  if (dest === 'error-kernel') {
    showSpecificError('error-kernel');
    return;
  }

  if (dest.startsWith('layer-')) {
    if (resetDepth) {
      State.depth = 0;
    }
    transitionToLayer(dest);
  }
}

function transitionToLayer(layerId) {
  const currentLayer = document.querySelector('.layer.active');
  const nextLayer = document.getElementById(layerId);

  if (!nextLayer) return;

  const depthMap = {
    'layer-surface': 0,
    'layer-errors': 1,
    'layer-database': 2,
    'layer-archive': 3,
    'layer-terminal': 4,
    'layer-hidden': 5
  };

  const newDepth = depthMap[layerId] !== undefined ? depthMap[layerId] : State.depth;

  if (currentLayer) {
    currentLayer.classList.add('transitioning-out');

    triggerCorruptionBurst();

    setTimeout(() => {
      currentLayer.classList.remove('active', 'transitioning-out');
      nextLayer.classList.add('active', 'transitioning-in');

      State.currentLayer = layerId;
      State.depth = newDepth;
      updateDepthIndicator();

      setTimeout(() => {
        nextLayer.classList.remove('transitioning-in');
      }, 600);

      if (layerId === 'layer-hidden') {
        revealHiddenPage();
      }

      if (layerId === 'layer-terminal') {
        setTimeout(() => {
          document.getElementById('terminal-input').focus();
        }, 700);
      }

      if (layerId === 'layer-archive') {
        startHitCounter();
      }
    }, 500);
  } else {
    nextLayer.classList.add('active');
    State.currentLayer = layerId;
    State.depth = newDepth;
    updateDepthIndicator();
  }
}

function showLayer(layerId) {
  const layer = document.getElementById(layerId);
  if (layer) {
    layer.classList.add('active');
    State.currentLayer = layerId;
  }
}

function showSpecificError(errorId) {
  document.querySelectorAll('.error-screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const target = document.getElementById(errorId);
  if (target) {
    target.classList.add('active');
  }

  if (errorId === 'error-bsod' || errorId === 'error-kernel') {
    triggerCorruptionBurst();
  }
}

function updateDepthIndicator() {
  const depthValue = document.getElementById('depth-value');
  const depthFill = document.getElementById('depth-fill');

  depthValue.textContent = State.depth;
  depthFill.style.width = (State.depth / 5 * 100) + '%';

  if (State.depth >= 4) {
    depthFill.style.background = 'var(--cyan-bright)';
    depthFill.style.boxShadow = '0 0 6px var(--cyan-bright)';
  } else if (State.depth >= 2) {
    depthFill.style.background = 'var(--amber-bright)';
    depthFill.style.boxShadow = '0 0 6px var(--amber-bright)';
  } else {
    depthFill.style.background = 'var(--green-bright)';
    depthFill.style.boxShadow = '0 0 6px var(--green-bright)';
  }
}

function triggerCorruptionBurst() {
  const overlay = document.getElementById('corruption-overlay');
  overlay.classList.add('active');
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 600);
}

function startStatusDegradation() {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  setTimeout(() => {
    statusDot.classList.add('degraded');
    statusText.textContent = 'SYSTEM DEGRADED';
  }, 8000);

  setTimeout(() => {
    statusDot.classList.remove('degraded');
    statusDot.classList.add('critical');
    statusText.textContent = 'SYSTEM CRITICAL';
    statusText.style.color = 'var(--red-bright)';
  }, 20000);
}

function startGlitchCycle() {
  State.glitchInterval = setInterval(() => {
    if (Math.random() < 0.3) {
      triggerRandomGlitch();
    }
  }, 4000);
}

function triggerRandomGlitch() {
  const activeLayer = document.querySelector('.layer.active');
  if (!activeLayer) return;

  const glitchableElements = activeLayer.querySelectorAll('p, span, h1, h2, h3, h4, a, button, td');
  if (glitchableElements.length === 0) return;

  const target = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];

  if (target.closest('#layer-hidden')) return;

  const originalText = target.textContent;
  const glitchChars = '█▓▒░╔╗╚╝║═╬┼┤├┬┴ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?';

  if (originalText.length > 3 && !target.classList.contains('glitch-text')) {
    const glitchLength = Math.min(Math.floor(originalText.length * 0.3), 8);
    const startPos = Math.floor(Math.random() * (originalText.length - glitchLength));
    let glitchedText = originalText.split('');

    for (let i = startPos; i < startPos + glitchLength; i++) {
      glitchedText[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }

    target.textContent = glitchedText.join('');
    target.style.textShadow = '2px 0 var(--cyan-bright), -2px 0 var(--red-bright)';

    setTimeout(() => {
      target.textContent = originalText;
      target.style.textShadow = '';
    }, 150 + Math.random() * 350);
  }

  if (Math.random() < 0.2) {
    triggerCorruptionBurst();
  }
}

let hitCounterStarted = false;
function startHitCounter() {
  if (hitCounterStarted) return;
  hitCounterStarted = true;

  const digits = document.querySelectorAll('#counter-digits .digit');
  let currentVal = 847;

  setInterval(() => {
    if (Math.random() < 0.3) {
      currentVal += Math.floor(Math.random() * 3) + 1;
      const str = String(currentVal).padStart(7, '0');
      digits.forEach((d, i) => {
        if (i < str.length) {
          d.textContent = str[i];
        }
      });
    }
  }, 2000);
}

function setupTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        State.commandHistory.push(cmd);
        State.historyIndex = State.commandHistory.length;
        processCommand(cmd);
        input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (State.historyIndex > 0) {
        State.historyIndex--;
        input.value = State.commandHistory[State.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (State.historyIndex < State.commandHistory.length - 1) {
        State.historyIndex++;
        input.value = State.commandHistory[State.historyIndex];
      } else {
        State.historyIndex = State.commandHistory.length;
        input.value = '';
      }
    }
  });
}

function processCommand(rawCmd) {
  const output = document.getElementById('terminal-output');
  const parts = rawCmd.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  addTerminalLine('<span class="cmd-echo"><span class="cmd-name">' + escapeHtml(rawCmd) + '</span></span>', '');

  switch (cmd) {
    case 'help':
      addTerminalLine('Available commands:', 'info-msg');
      addTerminalLine('  ls [path]        - List directory contents', 'output-msg');
      addTerminalLine('  cd [path]        - Change directory', 'output-msg');
      addTerminalLine('  cat [file]       - Display file contents', 'output-msg');
      addTerminalLine('  pwd              - Print working directory', 'output-msg');
      addTerminalLine('  whoami           - Display current user', 'output-msg');
      addTerminalLine('  date             - Display current date', 'output-msg');
      addTerminalLine('  history          - Show command history', 'output-msg');
      addTerminalLine('  clear            - Clear terminal screen', 'output-msg');
      addTerminalLine('  exit             - Exit terminal', 'output-msg');
      addTerminalLine('', '');
      addTerminalLine('Hint: explore the filesystem. Look for archived files.', 'warning-msg');
      break;

    case 'ls':
      cmdLs(args);
      break;

    case 'cd':
      cmdCd(args);
      break;

    case 'cat':
    case 'read':
    case 'open':
      cmdCat(args);
      break;

    case 'pwd':
      addTerminalLine(State.terminalDir, 'output-msg');
      break;

    case 'whoami':
      addTerminalLine('root', 'output-msg');
      addTerminalLine('Clearance: LEVEL_5', 'info-msg');
      break;

    case 'date':
      if (Math.random() < 0.4) {
        addTerminalLine('2003-11-19 03:14:07 UTC', 'output-msg');
      } else {
        addTerminalLine('20??-??-?? ??:??:?? UTC', 'error-msg');
      }
      break;

    case 'history':
      State.commandHistory.forEach((c, i) => {
        addTerminalLine('  ' + (i + 1) + '  ' + c, 'output-msg');
      });
      break;

    case 'clear':
      output.innerHTML = '';
      break;

    case 'exit':
      addTerminalLine('Connection to meridian-systems.net closed.', 'system-msg');
      addTerminalLine('', '');
      setTimeout(() => {
        addTerminalLine('Connection refused. The server is not responding.', 'error-msg');
        addTerminalLine('You cannot leave. You have not found what is hidden.', 'warning-msg');
      }, 1000);
      break;

    default:
      addTerminalLine('Command not found: ' + escapeHtml(cmd), 'error-msg');
      addTerminalLine('Type "help" for available commands.', 'system-msg');
  }

  scrollToTerminalBottom();
}

function cmdLs(args) {
  let targetPath = args[0] || State.terminalDir;

  if (targetPath === '-a' || targetPath === '-la' || targetPath === '-al') {
    targetPath = args[1] || State.terminalDir;
    const node = resolvePath(targetPath);
    if (node && node.type === 'dir') {
      let items = [...node.children];
      if (!items.includes('.') && targetPath === State.terminalDir) {
        items = ['.', '..', ...items];
      }
      addTerminalLine(items.map(i => {
        const childNode = resolvePath(resolveFullPath(targetPath) + '/' + i);
        if (childNode && childNode.type === 'dir') return i + '/';
        return i;
      }).join('  '), 'output-msg');

      if (targetPath === State.terminalDir || targetPath === '/home/admin') {
        addTerminalLine('', '');
        addTerminalLine('(Use "ls -a" to show hidden files)', 'system-msg');
      }
    } else {
      addTerminalLine('ls: cannot access ' + escapeHtml(targetPath) + ': No such file or directory', 'error-msg');
    }
    return;
  }

  const fullPath = resolveFullPath(targetPath);
  const node = resolvePath(fullPath);

  if (!node) {
    addTerminalLine('ls: cannot access ' + escapeHtml(targetPath) + ': No such file or directory', 'error-msg');
    return;
  }

  if (node.type === 'dir') {
    let items = [...node.children];
    const displayItems = items.map(i => {
      const childPath = fullPath === '/' ? '/' + i : fullPath + '/' + i;
      const childNode = State.terminalFs[childPath];
      if (childNode && childNode.type === 'dir') return i + '/';
      return i;
    });
    addTerminalLine(displayItems.join('  '), 'output-msg');
  } else {
    addTerminalLine(fullPath.split('/').pop(), 'output-msg');
  }
}

function cmdCd(args) {
  if (!args[0] || args[0] === '~') {
    State.terminalDir = '/home/admin';
    addTerminalLine('', '');
    return;
  }

  const targetPath = args[0];
  const fullPath = resolveFullPath(targetPath);
  const node = resolvePath(fullPath);

  if (!node) {
    addTerminalLine('cd: no such file or directory: ' + escapeHtml(targetPath), 'error-msg');
    return;
  }

  if (node.type !== 'dir') {
    addTerminalLine('cd: not a directory: ' + escapeHtml(targetPath), 'error-msg');
    return;
  }

  State.terminalDir = fullPath;
  addTerminalLine('', '');
}

function cmdCat(args) {
  if (!args[0]) {
    addTerminalLine('cat: missing file operand', 'error-msg');
    return;
  }

  const targetPath = args[0];
  const fullPath = resolveFullPath(targetPath);
  const node = resolvePath(fullPath);

  if (!node) {
    addTerminalLine('cat: ' + escapeHtml(targetPath) + ': No such file or directory', 'error-msg');
    return;
  }

  if (node.type === 'dir') {
    addTerminalLine('cat: ' + escapeHtml(targetPath) + ': Is a directory', 'error-msg');
    return;
  }

  if (node.content === '__HIDDEN_PAGE_TRIGGER__') {
    addTerminalLine('', '');
    addTerminalLine('Opening archived file...', 'info-msg');
    addTerminalLine('', '');
    addTerminalLine('  ___ _                        ', 'info-msg');
    addTerminalLine(' / __| |_  __ _ _ _  __ _ ___  ', 'info-msg');
    addTerminalLine(' \\__ \\ | \\/ _` | \' \\/ _` / -_) ', 'info-msg');
    addTerminalLine(' |___/_|\\_\\__,_|_||_\\__, \\___| ', 'info-msg');
    addTerminalLine('                     |___/     ', 'info-msg');
    addTerminalLine('', '');
    addTerminalLine('You found the original page.', 'warning-msg');
    addTerminalLine('It has been here since 1997.', 'warning-msg');
    addTerminalLine('Untouched. Intact. Waiting.', 'warning-msg');
    addTerminalLine('', '');

    setTimeout(() => {
      navigateTo('layer-hidden');
    }, 2500);
    return;
  }

  const lines = node.content.split('\n');
  lines.forEach(line => {
    if (line.includes('???') || line.includes('███')) {
      addTerminalLine(escapeHtml(line), 'error-msg');
    } else if (line.startsWith('[WARNING]') || line.startsWith('WARN:') || line.includes('WARNING')) {
      addTerminalLine(escapeHtml(line), 'warning-msg');
    } else if (line.startsWith('[2003') || line.startsWith('ERROR') || line.startsWith('CRITICAL') || line.startsWith('ALERT')) {
      addTerminalLine(escapeHtml(line), 'error-msg');
    } else if (line.startsWith('Note:') || line.startsWith('Hint:') || line.startsWith('I have')) {
      addTerminalLine(escapeHtml(line), 'info-msg');
    } else {
      addTerminalLine(escapeHtml(line), 'output-msg');
    }
  });
}

function resolvePath(inputPath) {
  let path = inputPath;

  if (!path.startsWith('/')) {
    path = State.terminalDir + '/' + path;
  }

  const parts = path.split('/').filter(p => p && p !== '.');
  const resolved = [];

  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  let fullPath = '/' + resolved.join('/');
  if (fullPath !== '/' && fullPath.endsWith('/')) {
    fullPath = fullPath.slice(0, -1);
  }

  return State.terminalFs[fullPath] || null;
}

function resolveFullPath(inputPath) {
  if (!inputPath) return State.terminalDir;

  let path = inputPath;
  if (!path.startsWith('/')) {
    path = State.terminalDir + '/' + path;
  }

  const parts = path.split('/').filter(p => p && p !== '.');
  const resolved = [];

  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  let fullPath = '/' + resolved.join('/');
  if (fullPath !== '/' && fullPath.endsWith('/')) {
    fullPath = fullPath.slice(0, -1);
  }

  return fullPath;
}

function addTerminalLine(text, className) {
  const output = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = 'terminal-line' + (className ? ' ' + className : '');
  line.innerHTML = text;
  output.appendChild(line);
  scrollToTerminalBottom();
}

function scrollToTerminalBottom() {
  const output = document.getElementById('terminal-output');
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function revealHiddenPage() {
  if (State.poemRevealed) return;
  State.poemRevealed = true;

  const poemLines = document.querySelectorAll('.poem-line:not(.poem-break)');
  const metaLines = document.querySelectorAll('#hidden-meta p');
  const hiddenTitle = document.getElementById('hidden-title');

  poemLines.forEach((line, i) => {
    line.style.animationDelay = (0.8 + i * 0.4) + 's';
  });

  metaLines.forEach((line, i) => {
    line.style.animationDelay = (4.5 + i * 0.5) + 's';
  });

  const scanlines = document.getElementById('scanlines');
  const screenTear = document.getElementById('screen-tear');
  scanlines.style.opacity = '0';
  screenTear.style.display = 'none';

  document.body.style.cursor = 'default';
}

document.addEventListener('DOMContentLoaded', init);
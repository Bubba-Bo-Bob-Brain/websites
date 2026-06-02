const SystemState = {
  power: false,
  displayMode: 'amber',
  currentPanel: 'filesPanel',
  dialAngle: 0,
  tapeUnits: {
    1: { state: 'stop', counter: 0, speed: 1 },
    2: { state: 'stop', counter: 0, speed: 1 }
  },
  uptime: 0,
  selectedFile: null,
  terminalHistory: [],
  logLevel: 'all',
  startupComplete: false
};

const PanelMap = {
  0: 'filesPanel',
  45: 'terminalPanel',
  90: 'systemPanel',
  135: 'networkPanel',
  180: 'toolsPanel',
  225: 'logsPanel',
  270: 'configPanel',
  315: 'usersPanel'
};

const DialAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const DialLabels = ['FILES', 'TERMINAL', 'SYSTEM', 'NETWORK', 'TOOLS', 'LOGS', 'CONFIG', 'USERS'];

const StartupMessages = [
  'OBERON-7 BIOS v4.2.1974',
  'INITIALIZING CORE MEMORY...',
  'MEMORY TEST: 256KW ... PASS',
  'LOADING TAPE CONTROLLER...',
  'MOUNTING SYSTEM BUFFER A...',
  'DISK CONTROLLER: 4 DRIVES DETECTED',
  'NETWORK INTERFACE: INITIALIZED',
  'LOADING KERNEL...',
  'KERNEL LOADED: BUILD 7749-D',
  'STARTING SYSTEM SERVICES...',
  'MOUNTING USER DIRECTORIES...',
  'SYSTEM READY'
];

function init() {
  const startupSequence = document.getElementById('startupSequence');
  const startupText = document.getElementById('startupText');
  const startupProgress = document.getElementById('startupProgress');
  
  let messageIndex = 0;
  let progress = 0;
  
  const messageInterval = setInterval(() => {
    if (messageIndex < StartupMessages.length) {
      startupText.textContent = StartupMessages[messageIndex];
      messageIndex++;
      progress = (messageIndex / StartupMessages.length) * 100;
      startupProgress.style.width = progress + '%';
    } else {
      clearInterval(messageInterval);
      setTimeout(() => {
        startupSequence.classList.add('hidden');
        SystemState.startupComplete = true;
        SystemState.power = true;
        document.getElementById('powerLed').classList.add('active');
        startUptimeCounter();
        startRandomActivity();
      }, 500);
    }
  }, 250);
}

function startUptimeCounter() {
  const uptimeDisplay = document.getElementById('uptimeDisplay');
  
  setInterval(() => {
    SystemState.uptime++;
    const hours = String(Math.floor(SystemState.uptime / 3600)).padStart(3, '0');
    const minutes = String(Math.floor((SystemState.uptime % 3600) / 60)).padStart(2, '0');
    const seconds = String(SystemState.uptime % 60).padStart(2, '0');
    uptimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
  
  const hourDeg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30 - 90;
  const minuteDeg = (now.getMinutes() + now.getSeconds() / 60) * 6 - 90;
  
  document.getElementById('hourHand').style.transform = `translateX(-50%) rotate(${hourDeg + 90}deg)`;
  document.getElementById('minuteHand').style.transform = `translateX(-50%) rotate(${minuteDeg + 90}deg)`;
}

function initDisplayModeToggle() {
  const amberBtn = document.getElementById('modeAmber');
  const greenBtn = document.getElementById('modeGreen');
  const body = document.body;
  
  amberBtn.addEventListener('click', () => {
    SystemState.displayMode = 'amber';
    body.removeAttribute('data-mode');
    amberBtn.classList.add('active');
    greenBtn.classList.remove('active');
    addPrintoutLine('DISPLAY MODE: AMBER PHOSPHOR');
  });
  
  greenBtn.addEventListener('click', () => {
    SystemState.displayMode = 'green';
    body.setAttribute('data-mode', 'green');
    greenBtn.classList.add('active');
    amberBtn.classList.remove('active');
    addPrintoutLine('DISPLAY MODE: GREEN PHOSPHOR');
  });
}

function initRotaryDial() {
  const dialKnob = document.getElementById('dialKnob');
  const navDisplay = document.getElementById('navDisplay');
  let currentIndex = 0;
  let isDragging = false;
  let startAngle = 0;
  let currentRotation = 0;
  
  dialKnob.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = dialKnob.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    dialKnob.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = dialKnob.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const diff = angle - startAngle;
    currentRotation += diff * (180 / Math.PI);
    startAngle = angle;
    
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const sector = Math.round(normalizedRotation / 45) % 8;
    const targetAngle = sector * 45;
    
    dialKnob.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg)`;
  });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    dialKnob.style.cursor = 'grab';
    
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const sector = Math.round(normalizedRotation / 45) % 8;
    const targetAngle = sector * 45;
    currentIndex = sector;
    
    dialKnob.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg)`;
    navDisplay.textContent = DialLabels[sector];
    
    switchPanel(PanelMap[targetAngle]);
  });
  
  dialKnob.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 8;
    const targetAngle = DialAngles[currentIndex];
    currentRotation = targetAngle;
    dialKnob.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg)`;
    navDisplay.textContent = DialLabels[currentIndex];
    switchPanel(PanelMap[targetAngle]);
  });
}

function switchPanel(panelId) {
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active-panel');
  });
  document.getElementById(panelId).classList.add('active-panel');
  SystemState.currentPanel = panelId;
}

function initTapeControls() {
  document.querySelectorAll('.tape-unit').forEach((unit, index) => {
    const unitNum = index + 1;
    const buttons = unit.querySelectorAll('.tape-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        setTapeState(unitNum, action);
      });
    });
  });
}

function setTapeState(unitNum, action) {
  const unit = document.getElementById(`tapeUnit${unitNum}`);
  const buttons = unit.querySelectorAll('.tape-btn');
  const leftReel = document.getElementById(`reel${unitNum}Left`);
  const rightReel = document.getElementById(`reel${unitNum}Right`);
  const tapeStrip = document.getElementById(`tapeStrip${unitNum}`);
  const meter = document.getElementById(`meter${unitNum}`);
  
  buttons.forEach(btn => btn.classList.remove('active'));
  unit.querySelector(`[data-action="${action}"]`).classList.add('active');
  
  leftReel.classList.remove('spinning', 'spinning-fast', 'spinning-slow');
  rightReel.classList.remove('spinning', 'spinning-fast', 'spinning-slow');
  tapeStrip.classList.remove('moving', 'moving-fast', 'moving-reverse', 'moving-reverse-fast');
  
  SystemState.tapeUnits[unitNum].state = action;
  
  switch(action) {
    case 'play':
      leftReel.classList.add('spinning');
      rightReel.classList.add('spinning');
      tapeStrip.classList.add('moving');
      meter.style.transform = 'translateX(-50%) rotate(15deg)';
      startCounter(unitNum, 1);
      addPrintoutLine(`TAPE UNIT ${unitNum}: PLAY STARTED`);
      break;
    case 'rewind':
      leftReel.classList.add('spinning-fast');
      rightReel.classList.add('spinning-fast');
      tapeStrip.classList.add('moving-reverse-fast');
      meter.style.transform = 'translateX(-50%) rotate(-35deg)';
      startCounter(unitNum, -5);
      addPrintoutLine(`TAPE UNIT ${unitNum}: REWINDING...`);
      break;
    case 'ffwd':
      leftReel.classList.add('spinning-fast');
      rightReel.classList.add('spinning-fast');
      tapeStrip.classList.add('moving-fast');
      meter.style.transform = 'translateX(-50%) rotate(35deg)';
      startCounter(unitNum, 5);
      addPrintoutLine(`TAPE UNIT ${unitNum}: FAST FORWARD...`);
      break;
    case 'stop':
      meter.style.transform = 'translateX(-50%) rotate(-45deg)';
      stopCounter(unitNum);
      addPrintoutLine(`TAPE UNIT ${unitNum}: STOPPED`);
      break;
  }
}

let counterIntervals = {};

function startCounter(unitNum, speed) {
  stopCounter(unitNum);
  const counterEl = document.getElementById(`counter${unitNum}`);
  
  counterIntervals[unitNum] = setInterval(() => {
    SystemState.tapeUnits[unitNum].counter += speed;
    if (SystemState.tapeUnits[unitNum].counter < 0) {
      SystemState.tapeUnits[unitNum].counter = 0;
      setTapeState(unitNum, 'stop');
    }
    counterEl.textContent = String(SystemState.tapeUnits[unitNum].counter).padStart(4, '0');
  }, 100);
}

function stopCounter(unitNum) {
  if (counterIntervals[unitNum]) {
    clearInterval(counterIntervals[unitNum]);
    delete counterIntervals[unitNum];
  }
}

function initFileBrowser() {
  const fileItems = document.querySelectorAll('.file-item');
  const selectedFileDisplay = document.getElementById('selectedFile');
  
  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      fileItems.forEach(f => f.dataset.selected = 'false');
      item.dataset.selected = 'true';
      SystemState.selectedFile = item.querySelector('.col-name').textContent;
      selectedFileDisplay.textContent = SystemState.selectedFile;
    });
    
    item.addEventListener('dblclick', () => {
      const filename = item.querySelector('.col-name').textContent;
      addPrintoutLine(`OPENING: ${filename}`);
      addTerminalLine(`Loading ${filename}...`);
      setTimeout(() => {
        addTerminalLine(`${filename} loaded successfully.`);
      }, 800);
    });
  });
  
  document.querySelectorAll('.file-toolbar .tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const target = SystemState.selectedFile || 'NO SELECTION';
      addPrintoutLine(`FILE ${action.toUpperCase()}: ${target}`);
      
      if (action === 'delete' && SystemState.selectedFile) {
        const item = document.querySelector(`[data-selected="true"]`);
        if (item) item.remove();
        SystemState.selectedFile = null;
        selectedFileDisplay.textContent = 'NONE';
      }
    });
  });
}

function initTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim();
      if (command) {
        addTerminalLine(`OPERATOR_7@OBERON:~$ ${command}`);
        processCommand(command);
        input.value = '';
      }
    }
  });
  
  input.focus();
  document.addEventListener('click', (e) => {
    if (SystemState.currentPanel === 'terminalPanel') {
      input.focus();
    }
  });
}

function addTerminalLine(text, isSystem = false) {
  const output = document.getElementById('terminalOutput');
  const line = document.createElement('div');
  line.className = `terminal-line ${isSystem ? 'system-line' : ''}`;
  line.textContent = text;
  output.appendChild(line);
  
  const screen = document.getElementById('terminalScreen');
  screen.scrollTop = screen.scrollHeight;
}

function processCommand(command) {
  const cmd = command.toLowerCase();
  const responses = {
    help: [
      'AVAILABLE COMMANDS:',
      '  help     - Display this help text',
      '  ls       - List directory contents',
      '  cat      - Display file contents',
      '  run      - Execute program',
      '  status   - System status report',
      '  clear    - Clear terminal screen',
      '  reboot   - Restart system',
      '  time     - Display current time'
    ],
    ls: [
      'SYSTEM.CFG    KERNEL.BIN    LOG_7749.DAT',
      'OPERATOR.NTS  TAPE_INDEX.TBL  NETWORK.MAP',
      '[ARCHIVES]    [PROGRAMS]'
    ],
    status: [
      'OBERON-7 SYSTEM STATUS',
      'CPU: HS-9900 @ 8MHz - NOMINAL',
      'MEMORY: 192KW/256KW ACTIVE',
      'DISK: 4 PACKS ONLINE',
      'TAPE: 2 UNITS READY',
      'NETWORK: 5/5 NODES ACTIVE',
      'UPTIME: See header display'
    ],
    clear: () => {
      document.getElementById('terminalOutput').innerHTML = '';
      return [];
    },
    time: () => {
      const now = new Date();
      return [`CURRENT TIME: ${now.toISOString().replace('T', ' ').slice(0, 19)}`];
    },
    reboot: () => {
      setTimeout(() => location.reload(), 1000);
      return ['SYSTEM REBOOT INITIATED...'];
    }
  };
  
  const response = responses[cmd] || [`COMMAND NOT FOUND: ${command}`, "TYPE 'HELP' FOR AVAILABLE COMMANDS"];
  const result = typeof response === 'function' ? response() : response;
  
  setTimeout(() => {
    result.forEach(line => addTerminalLine(line, true));
  }, 200);
}

function initNetworkMap() {
  const nodes = document.querySelectorAll('.network-node:not(.local-node)');
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const label = node.querySelector('.node-label').textContent;
      const icon = node.querySelector('.node-icon');
      icon.style.color = 'var(--phosphor)';
      icon.style.textShadow = '0 0 12px var(--phosphor-glow)';
      addPrintoutLine(`PINGING ${label}...`);
      
      setTimeout(() => {
        addPrintoutLine(`${label}: RESPONSE 24ms`);
      }, 600);
    });
  });
}

function initLogFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const entries = document.querySelectorAll('.log-entry');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const level = btn.dataset.level;
      entries.forEach(entry => {
        if (level === 'all' || entry.classList.contains(level)) {
          entry.style.display = 'grid';
        } else {
          entry.style.display = 'none';
        }
      });
    });
  });
}

function initSliders() {
  document.querySelectorAll('.analog-slider').forEach(slider => {
    const fill = slider.parentElement.querySelector('.slider-fill');
    
    slider.addEventListener('input', () => {
      fill.style.width = slider.value + '%';
    });
  });
}

function initRockerSwitches() {
  document.querySelectorAll('.rocker-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('active');
    });
  });
}

function initPrintout() {
  document.getElementById('printClear').addEventListener('click', () => {
    document.getElementById('printoutConsole').innerHTML = '';
  });
  
  document.getElementById('printFeed').addEventListener('click', () => {
    const console = document.getElementById('printoutConsole');
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      line.className = 'printout-line';
      line.innerHTML = '&nbsp;';
      console.appendChild(line);
    }
    console.scrollTop = console.scrollHeight;
  });
}

function addPrintoutLine(text) {
  const console = document.getElementById('printoutConsole');
  const line = document.createElement('div');
  line.className = 'printout-line';
  line.textContent = text;
  console.appendChild(line);
  console.scrollTop = console.scrollHeight;
}

function startRandomActivity() {
  setInterval(() => {
    if (!SystemState.power) return;
    
    const cpuGauge = document.getElementById('cpuGauge');
    const memGauge = document.getElementById('memGauge');
    const tempGauge = document.getElementById('tempGauge');
    
    const cpuLoad = -90 + Math.random() * 120;
    const memLoad = -90 + Math.random() * 80;
    const tempLoad = -90 + Math.random() * 100;
    
    if (cpuGauge) cpuGauge.style.transform = `translateX(-50%) rotate(${cpuLoad}deg)`;
    if (memGauge) memGauge.style.transform = `translateX(-50%) rotate(${memLoad}deg)`;
    if (tempGauge) tempGauge.style.transform = `translateX(-50%) rotate(${tempLoad}deg)`;
    
    if (Math.random() < 0.05) {
      const events = [
        { level: 'info', msg: 'Periodic memory refresh completed' },
        { level: 'info', msg: 'Disk cache flushed to storage' },
        { level: 'warn', msg: 'Minor timing drift detected on NODE-BETA' },
        { level: 'info', msg: 'Backup process initiated' }
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      addLogEntry(event.level, event.msg);
    }
  }, 2000);
}

function addLogEntry(level, message) {
  const container = document.getElementById('logContainer');
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  
  const entry = document.createElement('div');
  entry.className = `log-entry ${level}`;
  entry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-level">[${level.toUpperCase()}]</span>
    <span class="log-message">${message}</span>
  `;
  
  container.insertBefore(entry, container.firstChild);
  
  while (container.children.length > 50) {
    container.removeChild(container.lastChild);
  }
}

function initToolCards() {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const tool = card.dataset.tool;
      addPrintoutLine(`LAUNCHING UTILITY: ${tool.toUpperCase()}`);
      addTerminalLine(`Starting ${tool} utility...`, true);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  updateClock();
  setInterval(updateClock, 1000);
  initDisplayModeToggle();
  initRotaryDial();
  initTapeControls();
  initFileBrowser();
  initTerminal();
  initNetworkMap();
  initLogFilter();
  initSliders();
  initRockerSwitches();
  initPrintout();
  initToolCards();
});
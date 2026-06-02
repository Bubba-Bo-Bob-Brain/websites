// ===== GLOBAL STATE =====
const state = {
  theme: 'amber',       // 'amber' or 'green'
  power: true,          // OS on/off
  filesOpen: {},        // Track expanded file nodes
  terminalInput: '',    // Current terminal command
  logMessages: [],      // System log messages
  cpuUsage: 32,         // Simulated CPU %
  memoryUsage: 6.4,     // Simulated RAM (K)
};

// ===== DOM ELEMENTS =====
const elements = {
  crtScreen: document.querySelector('.crt-screen'),
  powerSwitch: document.querySelector('.control-panel .toggle-switch'),
  themeSwitch: document.querySelector('.control-panel .toggle-switch:nth-of-type(2)'),
  terminalOutput: document.querySelector('.terminal-output'),
  terminalInput: document.querySelector('.input-field'),
  cursor: document.querySelector('.cursor'),
  fileNodes: document.querySelectorAll('.file-node'),
  reels: document.querySelectorAll('.reel'),
  dialPointer: document.querySelector('.dial-pointer'),
  tickerTape: document.querySelector('.tape-content'),
  cpuGauge: document.querySelector('.cpu .meter-needle'),
  memoryGauge: document.querySelector('.memory .meter-needle'),
  cpuValue: document.querySelector('.cpu .gauge-value'),
  memoryValue: document.querySelector('.memory .gauge-value'),
  tapeLines: document.querySelectorAll('.tape-line'),
  gridButtons: document.querySelectorAll('.grid-btn'),
  emergencyButton: document.querySelector('.big-red-button'),
};

// ===== INITIALIZATION =====
function init() {
  setupEventListeners();
  updateGauges();
  startClock();
  loadLogMessages();
  animateReels(false); // Start with reels idle
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Power switch
  elements.powerSwitch.addEventListener('click', togglePower);

  // Theme switch
  elements.themeSwitch.addEventListener('click', toggleTheme);

  // File tree toggles
  elements.fileNodes.forEach(node => {
    const name = node.querySelector('.name');
    name.addEventListener('click', () => toggleFileNode(node));
  });

  // Rotary dial interaction
  const dialFace = document.querySelector('.dial-face');
  dialFace.addEventListener('click', (e) => {
    const rect = dialFace.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    rotateDial(angle);
  });

  // Terminal input
  elements.terminalInput.addEventListener('input', (e) => {
    state.terminalInput = e.target.value;
  });
  elements.terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeCommand(e.target.value);
  });

  // Function keys
  elements.gridButtons.forEach(btn => {
    btn.addEventListener('click', () => handleFunctionKey(btn.dataset.key));
  });

  // Emergency stop
  elements.emergencyButton.addEventListener('click', emergencyStop);
}

// ===== POWER/STATE MANAGEMENT =====
function togglePower() {
  state.power = !state.power;
  elements.powerSwitch.dataset.state = state.power ? 'on' : 'off';
  elements.crtScreen.style.opacity = state.power ? '1' : '0.3';
  logMessage(state.power ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE');
}

function toggleTheme() {
  state.theme = state.theme === 'amber' ? 'green' : 'amber';
  elements.themeSwitch.dataset.state = state.theme === 'green' ? 'on' : 'off';
  elements.crtScreen.classList.toggle('green-mode');
  logMessage(`THEME SWITCHED TO ${state.theme.toUpperCase()}`);
}

function emergencyStop() {
  logMessage('EMERGENCY STOP ACTIVATED!');
  animateReels(true); // Fast rewind
  setTimeout(() => {
    logMessage('SYSTEM HALTED');
    elements.crtScreen.style.opacity = '0.1';
  }, 2000);
}

// ===== FILE MANAGER =====
function toggleFileNode(node) {
  const children = node.querySelector('.children');
  const isOpen = node.classList.toggle('open');

  // Animate reels when opening/closing
  animateReels(isOpen);

  // Update state
  const name = node.querySelector('.name').textContent;
  state.filesOpen[name] = isOpen;

  // Log action
  logMessage(isOpen ? `OPENED: ${name}` : `CLOSED: ${name}`);
}

function animateReels(spin) {
  elements.reels.forEach(reel => {
    if (spin) {
      reel.style.animation = 'spin 0.5s linear infinite';
    } else {
      reel.style.animation = 'none';
    }
  });
}

// ===== ROTARY DIAL =====
function rotateDial(angle) {
  // Normalize angle to 0-360
  angle = ((angle + 360) % 360) + 90; // Offset for visual alignment
  if (angle > 180) angle -= 360; // Convert to -180-180 range

  // Snap to nearest notch (5 positions)
  const notchAngles = [-144, -72, 0, 72, 144];
  const snappedAngle = notchAngles.reduce((prev, curr) =>
    Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
  );

  // Update dial pointer
  elements.dialPointer.style.transform = `translateX(-50%) rotate(${snappedAngle}deg)`;

  // Log selected command
  const notchValue = Math.round((snappedAngle + 144) / 72 + 1);
  logMessage(`DIAL SET TO POSITION ${notchValue}`);
}

// ===== TERMINAL =====
function executeCommand(command) {
  if (!command.trim()) return;

  // Add command to output
  const commandLine = document.createElement('div');
  commandLine.className = 'line';
  commandLine.textContent = `> ${command}`;
  elements.terminalOutput.insertBefore(commandLine, elements.cursor.parentNode);

  // Process command
  const output = processTerminalCommand(command);
  if (output) {
    const outputLine = document.createElement('div');
    outputLine.className = 'line';
    outputLine.textContent = output;
    elements.terminalOutput.insertBefore(outputLine, elements.cursor.parentNode);
  }

  // Reset input
  elements.terminalInput.value = '';
  state.terminalInput = '';

  // Auto-scroll terminal
  elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
}

function processTerminalCommand(command) {
  const cmd = command.toUpperCase();
  switch (cmd) {
    case 'HELP':
      return 'AVAILABLE COMMANDS:\nHELP, LIST, THEME, REBOOT';
    case 'LIST':
      return 'FILES:\nLOG_1979.TXT\nPROJECTS/';
    case 'THEME':
      toggleTheme();
      return `SWITCHED TO ${state.theme.toUpperCase()} MODE`;
    case 'REBOOT':
      logMessage('REBOOT INITIATED...');
      return 'SYSTEM REBOOTING';
    default:
      return `ERROR: COMMAND "${command}" NOT RECOGNIZED`;
  }
}

// ===== SYSTEM LOG =====
function loadLogMessages() {
  // Initial log messages
  state.logMessages = [
    'LOG INITIATED 1979-12-15 23:47:11',
    'VOLUME "MAINFRAME" MOUNTED',
    'WARNING: REEL #3 SPEED FLUCTUATION',
    'USER AUTHENTICATED',
  ];

  updateTickerTape();
}

function logMessage(message) {
  state.logMessages.push(message);
  if (state.logMessages.length > 20) state.logMessages.shift();
  updateTickerTape();
}

function updateTickerTape() {
  const tapeContent = elements.tickerTape;
  tapeContent.innerHTML = state.logMessages.map(msg =>
    `<div class="tape-line">${msg}</div>`
  ).join('');

  // Restart animation
  tapeContent.style.animation = 'none';
  setTimeout(() => {
    tapeContent.style.animation = 'scroll-up 20s linear infinite';
  }, 10);
}

// ===== SYSTEM MONITOR =====
function updateGauges() {
  // Simulate CPU/RAM fluctuations
  setInterval(() => {
    state.cpuUsage = Math.max(5, Math.min(95, state.cpuUsage + (Math.random() * 10 - 5)));
    state.memoryUsage = Math.max(0.1, Math.min(12, state.memoryUsage + (Math.random() * 0.5 - 0.2)));

    const cpuAngle = (state.cpuUsage / 100) * 180 - 90;
    const memoryAngle = (state.memoryUsage / 12) * 180 - 90;

    elements.cpuGauge.style.transform = `rotate(${cpuAngle}deg)`;
    elements.memoryGauge.style.transform = `rotate(${memoryAngle}deg)`;
    elements.cpuValue.textContent = `${Math.round(state.cpuUsage)}%`;
    elements.memoryValue.textContent = `${state.memoryUsage.toFixed(1)}K`;
  }, 2000);
}

// ===== CLOCK =====
function startClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const date = now.toISOString().split('T')[0];

  document.querySelector('.time').textContent = time;
  document.querySelector('.date').textContent = date;
}

// ===== FUNCTION KEYS =====
function handleFunctionKey(key) {
  switch (key) {
    case 'F1':
      logMessage('HELP DISPLAYED');
      executeCommand('HELP');
      break;
    case 'F2':
      logMessage('LISTING FILES');
      executeCommand('LIST');
      break;
    case 'F3':
      toggleTheme();
      break;
    case 'F4':
      emergencyStop();
      break;
  }
}

// ===== STARTUP =====
init();
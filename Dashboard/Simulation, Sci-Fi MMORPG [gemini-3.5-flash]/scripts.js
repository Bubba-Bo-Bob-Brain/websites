/* ==========================================================================
   AETHER-NET TACTICAL TERMINAL SIMULATOR (scripts.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE SYSTEM ---
  const state = {
    soundActive: false,
    alertActive: false,
    zoomLevel: 1.0,
    mapOffset: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    selectedTarget: null,
    simulationUptime: 1735624, // Starting seconds
    resources: {
      dm: 1245892.4,
      he: 8412044.1,
      na: 451209.8,
      pc: 621480.0,
      is: 89211.5
    },
    threatLevels: ['STABLE', 'GUARDED', 'ELEVATED', 'HIGH', 'SEVERE'],
    currentThreatIndex: 3 // Start at ORANGE (High)
  };

  // --- AUDIO SYNTHESIS SYSTEM (Web Audio API) ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playBeep(freq, type, duration, volume = 0.05) {
    if (!state.soundActive) return;
    initAudio();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  function playAlertSiren() {
    if (!state.soundActive || !state.alertActive) return;
    initAudio();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);

      setTimeout(() => {
        if (state.alertActive) playAlertSiren();
      }, 850);
    } catch (e) {
      console.warn(e);
    }
  }

  // --- MAP DATABASE ---
  const mapTargets = [
    { id: 't1', name: 'HELIOS PRIME', type: 'STAR (CLASS G)', coords: '0.0.0', hab: '0.0%', faction: 'TERRAN HEGEMONY', x: 0, y: 0, size: 14, color: '#ffaa00' },
    { id: 't2', name: 'KRAKEN RESOURCE ARRAY', type: 'ASTEROID FIELDS', coords: 'SEC-099', hab: '1.2%', faction: 'NEUTRAL / PIRATE CONTROLLER', x: -140, y: 120, size: 5, color: '#ff0055' },
    { id: 't3', name: 'AETHER SHARD STATION', type: 'MILITARY STARBASE', coords: 'SEC-412', hab: '88.5%', faction: 'CYBERNETIC CONGLOMERATE', x: 180, y: -90, size: 7, color: '#aaff55' },
    { id: 't4', name: 'CHRONOS III OUTPOST', type: 'COLONY WORLD', coords: 'SEC-002', hab: '94.1%', faction: 'TERRAN HEGEMONY', x: -90, y: -110, size: 9, color: '#55aaff' },
    { id: 't5', name: 'NEBULA JUMP GATE', type: 'WARP CONNECTOR', coords: 'SEC-101', hab: 'N/A', faction: 'STABLE VECTOR UNKNOWN', x: 80, y: 150, size: 6, color: '#00f0ff' }
  ];

  // Set initial selected target
  state.selectedTarget = mapTargets[0];

  // --- TIME & CLOCKS SYSTEM ---
  function updateClocks() {
    const now = new Date();
    const stardate = (3024 + now.getMonth() / 12 + now.getDate() / 365).toFixed(4);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    
    document.getElementById('stardate-clock').innerText = `${stardate}.${hours}:${minutes}:${seconds}:${milliseconds}`;
    
    state.simulationUptime++;
    const upHrs = String(Math.floor(state.simulationUptime / 3600)).padStart(2, '0');
    const upMins = String(Math.floor((state.simulationUptime % 3600) / 60)).padStart(2, '0');
    const upSecs = String(state.simulationUptime % 60).padStart(2, '0');
    document.getElementById('sim-uptime').innerText = `${upHrs}:${upMins}:${upSecs}`;
    
    // CPU Temp Fluctuation
    const baseTemp = 34.2;
    const variant = Math.sin(Date.now() / 5000) * 0.4;
    document.getElementById('cpu-temp').innerText = `${(baseTemp + variant).toFixed(1)} °C`;
  }
  setInterval(updateClocks, 30);

  // --- RESOURCE SIMULATION ---
  function updateResources() {
    state.resources.dm += (Math.random() - 0.45) * 4;
    state.resources.he += (Math.random() - 0.4) * 12;
    state.resources.na += (Math.random() - 0.5) * 2;
    state.resources.pc += (Math.random() - 0.48) * 1.5;
    state.resources.is += (Math.random() - 0.5) * 0.5;

    document.querySelector('.value-dm').innerText = state.resources.dm.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
    document.querySelector('.value-he').innerText = state.resources.he.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
    document.querySelector('.value-na').innerText = state.resources.na.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
    document.querySelector('.value-pc').innerText = state.resources.pc.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
    document.querySelector('.value-is').innerText = state.resources.is.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
  }
  setInterval(updateResources, 1200);

  // --- ARBITRAGE SIMULATOR LOGIC ---
  const tradeAmount = document.getElementById('trade-amount');
  const tradeSource = document.getElementById('trade-source');
  const tradeTarget = document.getElementById('trade-target');
  const tradeYieldValue = document.getElementById('trade-yield-value');
  const rangeCurrentVal = document.getElementById('range-current-val');

  function calculateTradeYield() {
    const amt = parseFloat(tradeAmount.value);
    rangeCurrentVal.innerText = amt.toLocaleString();
    let rate = 1.0;
    
    // Simple rates matrix
    if (tradeSource.value === 'dm') rate = 42.15;
    if (tradeSource.value === 'he') rate = 12.08;
    if (tradeSource.value === 'na') rate = 115.40;

    if (tradeTarget.value === 'pc') rate /= 8.50;

    const finalYield = (amt * rate).toFixed(2);
    const unit = tradeTarget.value === 'cc' ? 'CC' : 'PLASMA CELLS';
    tradeYieldValue.innerText = `${finalYield} ${unit}`;
  }

  tradeAmount.addEventListener('input', () => {
    calculateTradeYield();
    playBeep(880, 'sine', 0.02, 0.02);
  });
  tradeSource.addEventListener('change', calculateTradeYield);
  tradeTarget.addEventListener('change', calculateTradeYield);
  calculateTradeYield();

  // --- TACTICAL MAP RENDERING ---
  const canvas = document.getElementById('sector-map-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2 + state.mapOffset.x;
    const centerY = canvas.height / 2 + state.mapOffset.y;

    // Draw grid background relative to camera
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSpacing = 40 * state.zoomLevel;
    const startX = (state.mapOffset.x % gridSpacing) - gridSpacing;
    const startY = (state.mapOffset.y % gridSpacing) - gridSpacing;

    for (let x = startX; x < canvas.width + gridSpacing; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = startY; y < canvas.height + gridSpacing; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Radar sweeps
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 150 * state.zoomLevel, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 300 * state.zoomLevel, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs at center
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY); ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 10); ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();

    // Draw targets
    mapTargets.forEach(tgt => {
      const screenX = centerX + tgt.x * state.zoomLevel;
      const screenY = centerY + tgt.y * state.zoomLevel;

      // Draw Orbit Rings around stars
      if (tgt.id === 't1') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, 140 * state.zoomLevel, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 210 * state.zoomLevel, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Selection Ring
      if (state.selectedTarget && state.selectedTarget.id === tgt.id) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, (tgt.size + 8) * state.zoomLevel, 0, Math.PI * 2);
        ctx.stroke();

        // Target label indicators
        ctx.font = '8px Share Tech Mono';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('◀ LOCK TARGET ▶', screenX + (tgt.size + 12) * state.zoomLevel, screenY + 3);
      }

      // Draw Planet Core
      ctx.fillStyle = tgt.color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, tgt.size * state.zoomLevel, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Glow
      ctx.strokeStyle = tgt.color;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(screenX, screenY, (tgt.size + 4) * state.zoomLevel, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Label
      ctx.fillStyle = 'rgba(209, 244, 255, 0.8)';
      ctx.font = '9px Share Tech Mono';
      ctx.fillText(tgt.name, screenX - 25, screenY - (tgt.size + 10));
    });

    requestAnimationFrame(drawMap);
  }
  requestAnimationFrame(drawMap);

  // --- MAP INTERACTION LURKERS ---
  canvas.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.dragStart = { x: e.clientX - state.mapOffset.x, y: e.clientY - state.mapOffset.y };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (state.isDragging) {
      state.mapOffset.x = e.clientX - state.dragStart.x;
      state.mapOffset.y = e.clientY - state.dragStart.y;
    }

    // Track coordinates on overlay
    const rect = canvas.getBoundingClientRect();
    const mapX = (e.clientX - rect.left - canvas.width / 2 - state.mapOffset.x) / state.zoomLevel;
    const mapY = (e.clientY - rect.top - canvas.height / 2 - state.mapOffset.y) / state.zoomLevel;

    document.getElementById('map-lat').innerText = (mapX * 12.4).toFixed(4);
    document.getElementById('map-lng').innerText = (mapY * 12.4).toFixed(4);
    document.getElementById('map-alt').innerText = (Math.sin(mapX) * 2000 + 4000).toFixed(2);
  });

  window.addEventListener('mouseup', () => {
    state.isDragging = false;
  });

  canvas.addEventListener('click', (e) => {
    // Determine target under click
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = canvas.width / 2 + state.mapOffset.x;
    const centerY = canvas.height / 2 + state.mapOffset.y;

    let targetFound = null;

    mapTargets.forEach(tgt => {
      const screenX = centerX + tgt.x * state.zoomLevel;
      const screenY = centerY + tgt.y * state.zoomLevel;
      const dist = Math.hypot(clickX - screenX, clickY - screenY);
      
      if (dist < (tgt.size + 15) * state.zoomLevel) {
        targetFound = tgt;
      }
    });

    if (targetFound) {
      state.selectedTarget = targetFound;
      updateTargetCard(targetFound);
      playBeep(1200, 'triangle', 0.1, 0.08);
      logToTerminal(`[TARGET SCAN] Targeted node: ${targetFound.name} [Type: ${targetFound.type}]`);
    }
  });

  function updateTargetCard(target) {
    const card = document.getElementById('target-info-card');
    card.style.display = 'block';
    document.getElementById('target-name').innerText = target.name;
    document.getElementById('target-type').innerText = target.type;
    document.getElementById('target-coords').innerText = target.coords;
    document.getElementById('target-hab').innerText = target.hab;
    document.getElementById('target-faction').innerText = target.faction;
    
    const factionText = document.getElementById('target-faction');
    factionText.className = '';
    if (target.faction.includes('TERRAN')) factionText.classList.add('terran-text');
    else if (target.faction.includes('CYBERNETIC')) factionText.classList.add('cyber-text');
    else factionText.classList.add('red-text');
  }
  // Initialize target card
  updateTargetCard(state.selectedTarget);

  // Map Navigation Controls
  document.getElementById('map-zoom-in').addEventListener('click', () => {
    state.zoomLevel = Math.min(2.5, state.zoomLevel + 0.1);
    playBeep(900, 'sine', 0.05);
  });

  document.getElementById('map-zoom-out').addEventListener('click', () => {
    state.zoomLevel = Math.max(0.4, state.zoomLevel - 0.1);
    playBeep(700, 'sine', 0.05);
  });

  document.getElementById('map-reset').addEventListener('click', () => {
    state.zoomLevel = 1.0;
    state.mapOffset = { x: 0, y: 0 };
    playBeep(600, 'sine', 0.1);
    logToTerminal('[SYSTEM] Resetting tactical sector map coordinates.');
  });

  document.getElementById('map-scan').addEventListener('click', () => {
    playBeep(1500, 'sine', 0.2, 0.15);
    logToTerminal('[SYSTEM-SCAN] Initiating deep spatial ping sweep...');
    setTimeout(() => {
      logToTerminal(`[SUCCESS] Scan complete. ${mapTargets.length} prime celestial structures analyzed.`);
    }, 1200);
  });

  // --- TERMINAL LOGGER SYSTEM ---
  const terminalLogStream = document.getElementById('terminal-log-stream');
  const terminalInput = document.getElementById('terminal-input');
  const terminalSendBtn = document.getElementById('terminal-send-btn');

  function logToTerminal(message, type = 'info-line') {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const prefix = `[3024.182.${hrs}:${mins}:${secs}] `;

    const line = document.createElement('div');
    line.classList.add('log-line', type);
    line.innerText = `${prefix} ${message}`;
    
    terminalLogStream.appendChild(line);
    terminalLogStream.scrollTop = terminalLogStream.scrollHeight;
  }

  // Handle Command Inputs
  function executeTerminalCommand() {
    const rawCmd = terminalInput.value.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase();
    logToTerminal(`> ${rawCmd}`, 'system-line');
    terminalInput.value = '';

    playBeep(1100, 'sine', 0.05, 0.05);

    if (cmd === 'help') {
      logToTerminal('Available commands: status, scan, warp-all, clear, alert, stabilize, sound', 'success-line');
    } else if (cmd === 'status') {
      logToTerminal(`Simulation Core: Active | Latency: 12ms | Threat: ${state.threatLevels[state.currentThreatIndex]}`, 'success-line');
    } else if (cmd === 'scan') {
      logToTerminal('Performing sensor sweeps... No hostile cloaked cruisers found near Sol.', 'info-line');
    } else if (cmd === 'warp-all') {
      logToTerminal('[CRITICAL ERROR] Insufficient Dark Matter reserves to warp global fleet assets!', 'error-line');
      playBeep(180, 'sawtooth', 0.3, 0.15);
    } else if (cmd === 'clear') {
      terminalLogStream.innerHTML = '';
      logToTerminal('Terminal stream cleared by authority request.', 'system-line');
    } else if (cmd === 'alert') {
      triggerThreatOverride();
    } else if (cmd === 'stabilize') {
      stabilizeThreat();
    } else if (cmd === 'sound') {
      toggleSound();
    } else {
      logToTerminal(`Unknown protocol identifier: "${cmd}". Type "help" for core command set.`, 'error-line');
    }
  }

  terminalSendBtn.addEventListener('click', executeTerminalCommand);
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeTerminalCommand();
    }
  });

  // Periodically emit random environmental simulation logs to increase depth & immersion
  const randomEvents = [
    { text: "Solar Flare intensity elevated in Sector 412. Nano-Shields stabilizing.", type: "info-line" },
    { text: "Neutral mining vessels report minor hull breaches at Kraken Maw.", type: "warning-line" },
    { text: "Quantum Core sync threshold operating at 99.82% bandwidth efficiency.", type: "success-line" },
    { text: "Terran Trade Cargo Convoy safely entered Sector 002 orbital corridor.", type: "success-line" },
    { text: "Anomalous hyperwave signal intercepted. Source unknown.", type: "warning-line" }
  ];

  setInterval(() => {
    if (Math.random() > 0.6) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      logToTerminal(event.text, event.type);
    }
  }, 9000);

  // --- AUDIO CONTROLS & ALERTS OVERRIDE ---
  const btnSound = document.getElementById('btn-sound');
  const btnAlert = document.getElementById('btn-alert');

  function toggleSound() {
    state.soundActive = !state.soundActive;
    if (state.soundActive) {
      btnSound.innerText = '🔊';
      btnSound.classList.add('cyan-bg');
      logToTerminal('[AUDIO] Neural auditory uplink initialized.');
      playBeep(1000, 'sine', 0.15, 0.1);
    } else {
      btnSound.innerText = '🔇';
      btnSound.classList.remove('cyan-bg');
      logToTerminal('[AUDIO] Neural auditory link offline.');
    }
  }

  btnSound.addEventListener('click', toggleSound);

  function triggerThreatOverride() {
    state.alertActive = !state.alertActive;
    if (state.alertActive) {
      document.body.style.boxShadow = 'inset 0 0 100px rgba(255, 0, 85, 0.35)';
      btnAlert.classList.add('pulsing');
      document.getElementById('threat-level').innerText = 'CRITICAL';
      document.getElementById('threat-level').className = 'value red-text pulsing';
      logToTerminal('[ALERT STATUS] Threat matrix raised to SEVERE level. Security measures initiated!', 'error-line');
      playAlertSiren();
    } else {
      stabilizeThreat();
    }
  }

  function stabilizeThreat() {
    state.alertActive = false;
    document.body.style.boxShadow = 'none';
    btnAlert.classList.remove('pulsing');
    document.getElementById('threat-level').innerText = 'HIGH';
    document.getElementById('threat-level').className = 'value red-text';
    logToTerminal('[ALERT STATUS] Tactical stabilization matrix online. Crisis averted.', 'success-line');
  }

  btnAlert.addEventListener('click', () => {
    initAudio();
    triggerThreatOverride();
  });

  // --- INTERACTIVE FLEETS MATRIX ---
  document.querySelectorAll('.fleet-unit').forEach(unit => {
    unit.addEventListener('click', () => {
      const unitId = unit.querySelector('.unit-id').innerText;
      playBeep(1400, 'sine', 0.04, 0.05);
      logToTerminal(`[FLEET SCAN] Synchronized connection to unit: ${unitId}. Monitoring hyper-vector lanes.`);
    });
  });

  // --- INTERACTIVE TECH TREE MATRIX ---
  document.querySelectorAll('.tech-node').forEach(node => {
    node.addEventListener('click', () => {
      const nodeName = node.querySelector('.node-name').innerText;
      const isLocked = node.classList.contains('locked');
      
      if (isLocked) {
        playBeep(220, 'sawtooth', 0.2, 0.1);
        logToTerminal(`[RESEARCH INTERRUPT] Unable to initiate ${nodeName}. Dependent technology node missing.`, 'error-line');
      } else {
        playBeep(1300, 'sine', 0.1, 0.08);
        logToTerminal(`[RESEARCH INJECT] Active neural cycles redirected to ${nodeName}. Boost applied.`, 'success-line');
      }
    });
  });
});
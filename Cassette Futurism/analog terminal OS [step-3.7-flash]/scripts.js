// Retrodyne 7700 OS - 1970s Retro-Futuristic Interface Scripts
(function() {
  // DOM Element Selection
  const screenContainer = document.querySelector('.screen-container');
  const phosphorToggle = document.getElementById('phosphorToggle');
  const systemClock = document.getElementById('systemClock');
  const tapeActivityLight = document.getElementById('tapeActivityLight');
  const supplyReel = document.getElementById('supplyReel');
  const takeupReel = document.getElementById('takeupReel');
  const tapeStrip = document.getElementById('tapeStrip');
  const tapeControls = document.querySelector('.tape-controls');
  const tapeBtns = document.querySelectorAll('.tape-btn');
  const fileList = document.getElementById('fileList');
  const fileItems = document.querySelectorAll('.file-item');
  const storageNeedle = document.getElementById('storageNeedle');
  const storageValue = document.getElementById('storageValue');
  const headNeedle = document.getElementById('headNeedle');
  const headValue = document.getElementById('headValue');
  const rotaryDial = document.getElementById('rotaryDial');
  const curvatureKnob = document.getElementById('curvatureKnob');
  const switches = document.querySelectorAll('.chunky-switch');
  const tickerContent = document.getElementById('tickerContent');
  const powerIndicator = document.querySelector('.power-indicator');
  const powerSwitch = document.getElementById('powerSwitch');

  // State Management
  let state = {
    phosphorMode: 'amber',
    tapeState: 'stopped', // stopped, playing, rewinding, fastForwarding
    tapeInserted: true,
    selectedFileIndex: 0,
    curvature: 0,
    switches: {
      power: true,
      brightness: true,
      persistence: false,
      tapeDrive: true,
      buzzer: false
    },
    isDraggingDial: false,
    isDraggingCurvature: false,
    dialStartAngle: 0,
    curvatureStartAngle: 0
  };

  // Audio Context for Beeps (no external assets)
  let audioContext = null;

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playBeep(frequency = 800, duration = 0.1, type = 'square') {
    if (!state.switches.buzzer || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }

  // Load Saved Preferences
  function loadPreferences() {
    const saved = localStorage.getItem('retrodyne7700_prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      state.phosphorMode = prefs.phosphorMode || 'amber';
      state.curvature = prefs.curvature || 0;
      state.switches = { ...state.switches, ...prefs.switches };
      applyPhosphorMode();
      applyCurvature();
      switches.forEach(switchEl => {
        const switchName = switchEl.id.replace('Switch', '');
        if (state.switches[switchName]) {
          switchEl.classList.add('active');
          switchEl.setAttribute('aria-checked', 'true');
        } else {
          switchEl.classList.remove('active');
          switchEl.setAttribute('aria-checked', 'false');
        }
      });
      updatePowerState();
    }
    updateGauges();
  }

  // Save Preferences
  function savePreferences() {
    const prefs = {
      phosphorMode: state.phosphorMode,
      curvature: state.curvature,
      switches: state.switches
    };
    localStorage.setItem('retrodyne7700_prefs', JSON.stringify(prefs));
  }

  // Phosphor Mode Toggle
  function applyPhosphorMode() {
    screenContainer.setAttribute('data-phosphor', state.phosphorMode);
    phosphorToggle.querySelector('.mode-label').textContent = state.phosphorMode.toUpperCase();
    savePreferences();
  }

  phosphorToggle.addEventListener('click', () => {
    initAudio();
    state.phosphorMode = state.phosphorMode === 'amber' ? 'green' : 'amber';
    applyPhosphorMode();
    playBeep(600, 0.1);
    addLogEntry(`PHOSPHOR MODE SWITCHED TO ${state.phosphorMode.toUpperCase()}`);
  });

  // System Clock
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    systemClock.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Tape Drive Controls
  function updateTapeState() {
    // Reset all animations
    supplyReel.classList.remove('spinning');
    takeupReel.classList.remove('spinning');
    tapeStrip.classList.remove('rewinding', 'playing', 'fastForward');
    tapeActivityLight.classList.remove('active');

    if (!state.switches.power || !state.switches.tapeDrive || !state.tapeInserted) {
      state.tapeState = 'stopped';
      updateTapeButtons();
      return;
    }

    tapeActivityLight.classList.add('active');
    switch (state.tapeState) {
      case 'playing':
        supplyReel.classList.add('spinning');
        takeupReel.classList.add('spinning');
        tapeStrip.classList.add('playing');
        // Simulate supply reel slowing down as tape depletes
        supplyReel.style.animationDuration = '1.5s';
        takeupReel.style.animationDuration = '1s';
        break;
      case 'rewinding':
        supplyReel.classList.add('spinning');
        takeupReel.classList.add('spinning');
        tapeStrip.classList.add('rewinding');
        supplyReel.style.animationDuration = '0.3s';
        takeupReel.style.animationDuration = '0.5s';
        break;
      case 'fastForwarding':
        supplyReel.classList.add('spinning');
        takeupReel.classList.add('spinning');
        tapeStrip.classList.add('fastForward');
        supplyReel.style.animationDuration = '0.2s';
        takeupReel.style.animationDuration = '0.1s';
        break;
    }
    updateTapeButtons();
  }

  function updateTapeButtons() {
    tapeBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.id === 'stopBtn' && state.tapeState === 'stopped') btn.classList.add('active');
      if (btn.id === 'playBtn' && state.tapeState === 'playing') btn.classList.add('active');
      if (btn.id === 'rewBtn' && state.tapeState === 'rewinding') btn.classList.add('active');
      if (btn.id === 'ffBtn' && state.tapeState === 'fastForwarding') btn.classList.add('active');
    });
  }

  tapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.switches.power || !state.switches.tapeDrive) {
        addLogEntry('ERROR: TAPE DRIVE DISABLED OR SYSTEM OFF');
        playBeep(200, 0.3, 'sawtooth');
        return;
      }
      initAudio();
      const action = btn.id.replace('Btn', '');
      switch (action) {
        case 'play':
          if (!state.tapeInserted) {
            addLogEntry('ERROR: NO CARTRIDGE INSERTED');
            playBeep(200, 0.3, 'sawtooth');
            return;
          }
          state.tapeState = 'playing';
          addLogEntry('PLAYBACK STARTED');
          break;
        case 'stop':
          state.tapeState = 'stopped';
          addLogEntry('PLAYBACK STOPPED');
          break;
        case 'rew':
          if (!state.tapeInserted) {
            addLogEntry('ERROR: NO CARTRIDGE INSERTED');
            playBeep(200, 0.3, 'sawtooth');
            return;
          }
          state.tapeState = 'rewinding';
          addLogEntry('REWINDING TAPE...');
          break;
        case 'ff':
          if (!state.tapeInserted) {
            addLogEntry('ERROR: NO CARTRIDGE INSERTED');
            playBeep(200, 0.3, 'sawtooth');
            return;
          }
          state.tapeState = 'fastForwarding';
          addLogEntry('FAST FORWARDING...');
          break;
        case 'eject':
          state.tapeState = 'stopped';
          state.tapeInserted = false;
          addLogEntry('TAPE CARTRIDGE EJECTED');
          playBeep(400, 0.2);
          break;
      }
      playBeep(600, 0.1);
      updateTapeState();
    });
  });

  // File Manager
  function selectFile(index) {
    if (index < 0 || index >= fileItems.length) return;
    state.selectedFileIndex = index;
    fileItems.forEach((item, i) => {
      item.classList.toggle('selected', i === index);
    });
    updateGauges();
    addLogEntry(`SELECTED FILE: ${fileItems[index].dataset.name.toUpperCase()}`);
    playBeep(500, 0.05);
  }

  function updateGauges() {
    // Head gauge (track position)
    const trackAngle = -60 + (state.selectedFileIndex / (fileItems.length - 1)) * 120;
    headNeedle.style.transform = `translateX(-50%) rotate(${trackAngle}deg)`;
    headValue.textContent = `TRK ${String(state.selectedFileIndex + 1).padStart(2, '0')}`;

    // Storage gauge (fluctuates slightly based on selected file size)
    const baseStorage = 42;
    const fileSize = parseFloat(fileItems[state.selectedFileIndex].dataset.size);
    const storageFluctuation = (fileSize / 10) * 2; // Small fluctuation based on file size
    const storagePercent = Math.min(100, baseStorage + storageFluctuation);
    const storageAngle = -60 + (storagePercent / 100) * 120;
    storageNeedle.style.transform = `translateX(-50%) rotate(${storageAngle}deg)`;
    storageValue.textContent = `${Math.round(storagePercent)}%`;
  }

  // File Selection Events
  fileItems.forEach((item, index) => {
    item.addEventListener('click', () => selectFile(index));
  });

  // Keyboard Navigation for Files
  document.addEventListener('keydown', (e) => {
    if (!state.switches.power) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectFile(state.selectedFileIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectFile(state.selectedFileIndex - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      if (state.tapeState === 'playing') {
        document.getElementById('stopBtn').click();
      } else if (state.tapeInserted) {
        document.getElementById('playBtn').click();
      }
    }
  });

  // Rotary Dial Navigation
  function getAngleFromEvent(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }

  rotaryDial.addEventListener('mousedown', (e) => {
    if (!state.switches.power) return;
    initAudio();
    state.isDraggingDial = true;
    state.dialStartAngle = getAngleFromEvent(e, rotaryDial) - (state.selectedFileIndex * 30);
    playBeep(400, 0.05);
  });

  // Curvature Knob
  curvatureKnob.addEventListener('mousedown', (e) => {
    if (!state.switches.power) return;
    initAudio();
    state.isDraggingCurvature = true;
    state.curvatureStartAngle = getAngleFromEvent(e, curvatureKnob) - state.curvature;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (state.isDraggingDial) {
      const currentAngle = getAngleFromEvent(e, rotaryDial);
      let rotation = currentAngle - state.dialStartAngle;
      // Normalize rotation to 0-360
      rotation = (rotation + 360) % 360;
      // Map rotation to file index (12 ticks, 30 degrees per file)
      const newIndex = Math.round(rotation / 30) % fileItems.length;
      if (newIndex !== state.selectedFileIndex) {
        selectFile(newIndex);
      }
      rotaryDial.style.transform = `rotate(${rotation}deg)`;
    }
    if (state.isDraggingCurvature) {
      const currentAngle = getAngleFromEvent(e, curvatureKnob);
      let curvature = currentAngle - state.curvatureStartAngle;
      // Clamp curvature between -30 and 30 degrees
      curvature = Math.max(-30, Math.min(30, curvature));
      state.curvature = curvature;
      applyCurvature();
      savePreferences();
    }
  });

  document.addEventListener('mouseup', () => {
    if (state.isDraggingDial) {
      state.isDraggingDial = false;
      playBeep(400, 0.05);
    }
    if (state.isDraggingCurvature) {
      state.isDraggingCurvature = false;
      playBeep(400, 0.05);
    }
  });

  function applyCurvature() {
    screenContainer.style.setProperty('--curvature', `${state.curvature}deg`);
    // Adjust barrel distortion based on curvature
    const distortionScale = 1 + (state.curvature / 200);
    document.querySelector('.barrel-distortion').style.transform = `scale(${distortionScale})`;
  }

  // Chunky Switch Toggles
  switches.forEach(switchEl => {
    switchEl.addEventListener('click', () => {
      if (!state.switches.power && switchEl.id !== 'powerSwitch') return;
      initAudio();
      const switchName = switchEl.id.replace('Switch', '');
      state.switches[switchName] = !state.switches[switchName];
      switchEl.classList.toggle('active');
      switchEl.setAttribute('aria-checked', state.switches[switchName]);
      playBeep(700, 0.1);
      addLogEntry(`${switchName.toUpperCase()} SWITCH ${state.switches[switchName] ? 'ON' : 'OFF'}`);
      savePreferences();

      // Handle specific switch effects
      if (switchName === 'power') {
        updatePowerState();
      } else if (switchName === 'tapeDrive') {
        if (!state.switches.tapeDrive) {
          state.tapeState = 'stopped';
          updateTapeState();
        }
      } else if (switchName === 'buzzer') {
        if (state.switches.buzzer) playBeep(1000, 0.2);
      } else if (switchName === 'persistence') {
        const bloom = document.querySelector('.phosphor-bloom');
        bloom.style.animationDuration = state.switches.persistence ? '8s' : '4s';
      }
    });

    // Keyboard accessibility for switches
    switchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchEl.click();
      }
    });
  });

  function updatePowerState() {
    if (state.switches.power) {
      screenContainer.style.opacity = '1';
      powerIndicator.style.opacity = '1';
      addLogEntry('SYSTEM POWER ON');
      playBeep(500, 0.1);
      setTimeout(() => playBeep(700, 0.1), 150);
      setTimeout(() => playBeep(900, 0.2), 300);
    } else {
      screenContainer.style.opacity = '0.2';
      powerIndicator.style.opacity = '0.3';
      state.tapeState = 'stopped';
      updateTapeState();
      addLogEntry('SYSTEM POWER OFF');
      playBeep(900, 0.1);
      setTimeout(() => playBeep(700, 0.1), 150);
      setTimeout(() => playBeep(500, 0.2), 300);
    }
  }

  // Ticker Log System
  function addLogEntry(message, delay = 0) {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'ticker-line';
      line.textContent = `> ${message}`;
      tickerContent.appendChild(line);
      // Auto-scroll to bottom
      tickerContent.scrollTop = tickerContent.scrollHeight;
      // Play print sound if buzzer is on
      if (state.switches.buzzer) playBeep(200, 0.02);
    }, delay);
  }

  // Boot Sequence
  function runBootSequence() {
    // Initial state: screen off
    screenContainer.style.opacity = '0';
    powerIndicator.style.opacity = '0';
    state.switches.power = false;
    powerSwitch.classList.remove('active');
    powerSwitch.setAttribute('aria-checked', 'false');

    // Boot log entries
    const bootLogs = [
      'INITIALIZING RETRODYNE 7700 BIOS...',
      'MEMORY TEST: 64KB OK',
      'TAPE DRIVE CALIBRATION COMPLETE',
      'LOADING PHOSPHOR DRIVER: AMBER',
      'MOUNTING FILE SYSTEM: CARTRIDGE_001',
      'SYSTEM READY FOR USER INPUT'
    ];

    // Staggered boot animation
    let delay = 500;
    bootLogs.forEach((log, i) => {
      addLogEntry(log, delay + (i * 800));
    });

    // Power on after boot
    setTimeout(() => {
      state.switches.power = true;
      powerSwitch.classList.add('active');
      powerSwitch.setAttribute('aria-checked', 'true');
      updatePowerState();
      // Animate gauges to initial position
      updateGauges();
    }, delay + (bootLogs.length * 800) + 500);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    runBootSequence();
  });

  // Handle window resize for responsive adjustments
  window.addEventListener('resize', () => {
    // Recalculate gauge positions if needed
    updateGauges();
  });
})();
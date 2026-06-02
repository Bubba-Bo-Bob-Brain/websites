/* ==========================================================================
   KRONOS Terminal v2.4.1 — Interactive Systems
   Datasystems Division, Federal Compute Authority
   "The future that never was"
   ========================================================================== */

(function () {
  'use strict';

  /* ===== STATE ===== */
  const STATE = {
    power: 'off',          // 'off' | 'standby' | 'on'
    theme: 'amber',        // 'amber' | 'green' | 'blue' | 'white'
    tapeRunning: false,
    tapeDirection: null,    // null | 'fwd' | 'rew'
    tapePosition: 0,        // 0-100
    tapeVolume: 'KRONOS$DATA_VOL_07',
    cpuLoad: 35,
    memUsage: 62,
    netIO: 18,
    knBrt: 30,
    knCont: 50,
    knVol: 50,
    channel: 0,
    uptimeSeconds: 171247,
    winsMinimized: new Set(),
    selectedFile: null,
    currentTab: 'manifest',
    commandHistory: [],
    historyIndex: -1,
    typingInterval: null,
    booted: false,
  };

  /* ===== DOM REFS ===== */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const elMonitor   = $('#crt-monitor');
  const elScreen    = $('.screen');
  const elDesktop   = $('#desktop');
  const elPower     = $('#power-switch');
  const elPowerLed  = $('#power-led');
  const elPowerToggle = $('#power-toggle');
  const elAmbient   = $('#ambient-glow');
  const elFlicker   = $('.flicker-overlay');
  const elScanlines = $('.scanlines');
  const elTicker    = $('#ticker-content');
  const elTickerTime = $('#ticker-time');
  const elTapeLeft  = $('#reel-left');
  const elTapeRight = $('#reel-right');
  const elTapeStrip = $('#tape-strip');
  const elTapeProgressFill = $('#tape-progress-fill');
  const elTapeProgressHead = $('#tape-progress-head');
  const elTapePct   = $('#tape-progress-pct');
  const elTapeStatus = $('#tape-status');
  const elVolFill   = $('#vol-fill');
  const elVolThumb  = $('#vol-thumb');
  const elConsoleIn = $('#console-input');
  const elKeyboardHint = $('#keyboard-hint');

  /* ===== BOOT SEQUENCE ===== */
  function boot() {
    if (STATE.booted) return;
    STATE.booted = true;

    // Disable input during boot
    elConsoleIn.disabled = true;

    const bootMsgs = [
      { delay: 0,   msg: '▸ KRONOS BIOS v1.0.0 — INITIALIZING...', cls: 'sys-msg' },
      { delay: 400, msg: '▸ CPU: KRONOS-79 @ 2.4MHz — OK', cls: 'sys-msg' },
      { delay: 800, msg: '▸ PROBE MEMORY: 65536K BYTES...', cls: 'sys-msg' },
      { delay: 1200, msg: '▸ MEMORY CHECK: 64K OK — PARITY VERIFIED', cls: 'ok-msg' },
      { delay: 1600, msg: '▸ FLOPPY CONTROLLER: FD-800 DETECTED', cls: 'sys-msg' },
      { delay: 2000, msg: '▸ TAPE CONTROLLER: REEL-TO-REEL DT-880', cls: 'sys-msg' },
      { delay: 2400, msg: '▸ NETWORK INTERFACE: NIU-300 ASYNC', cls: 'sys-msg' },
      { delay: 2800, msg: '▸ NETWORK LINK ESTABLISHED — 300 BAUD', cls: 'ok-msg' },
      { delay: 3200, msg: '▸ LOADING KERNEL: KRNL-79.BIN', cls: 'sys-msg' },
      { delay: 3800, msg: '▸ ████ KERNEL LOADED ████', cls: 'ok-msg' },
      { delay: 4200, msg: '▸ MOUNTING VOLUME: KRONOS$DATA_VOL_07', cls: 'sys-msg' },
      { delay: 4600, msg: '▸ 12 FILES INDEXED — 847K FREE', cls: 'data-msg' },
      { delay: 5000, msg: '▸ DISPLAY ADAPTER: PHOSPHOR-79', cls: 'sys-msg' },
      { delay: 5400, msg: '▸ CALIBRATING PHOSPHOR OUTPUT...', cls: 'sys-msg' },
      { delay: 5800, msg: '▸ █████ DESKTOP RENDERER: ACTIVE █████', cls: 'ok-msg' },
      { delay: 6200, msg: '▸ SYSTEM SERVICES: 14/14 RUNNING', cls: 'ok-msg' },
      { delay: 6600, msg: '✓ KRONOS v2.4.1 SYSTEM INITIALIZED — READY', cls: 'ok-msg' },
      { delay: 7000, msg: '▸ OPERATOR LOGIN: TECHNICIAN_7', cls: 'user-msg' },
      { delay: 7500, msg: '✓ ALL SYSTEMS NOMINAL — SECTOR 4-CLEAR', cls: 'ok-msg' },
    ];

    // Dim screen effect during boot
    elScreen.style.opacity = '0.3';
    elScreen.style.filter = 'brightness(0.5)';

    let lastDelay = 0;
    bootMsgs.forEach((item) => {
      setTimeout(() => {
        appendTapeLine(item.msg, item.cls);
        if (item.cls === 'ok-msg') {
          triggerLedPulse('led-cpu');
        }
      }, item.delay);
      lastDelay = item.delay;
    });

    setTimeout(() => {
      elScreen.style.transition = 'opacity 0.8s, filter 0.8s';
      elScreen.style.opacity = '1';
      elScreen.style.filter = 'brightness(1)';
      setTimeout(() => {
        elScreen.style.transition = '';
        elScreen.style.filter = '';
      }, 900);
    }, lastDelay + 400);

    setTimeout(() => {
      elConsoleIn.disabled = false;
      elConsoleIn.focus();
      setState('power', 'on');
    }, lastDelay + 800);
  }

  /* ===== TAPE LINE APPEND ===== */
  function appendTapeLine(text, cls) {
    const div = document.createElement('div');
    div.className = 'tape-line ' + (cls || 'sys-msg');
    div.textContent = text;
    elTicker.appendChild(div);
    elTicker.scrollTop = elTicker.scrollHeight;
    // Keep last 50 lines
    while (elTicker.children.length > 50) {
      elTicker.removeChild(elTicker.firstChild);
    }
  }

  /* ===== LED PULSE ===== */
  function triggerLedPulse(id) {
    const el = $('#' + id);
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 2000);
  }

  /* ===== POWER SYSTEM ===== */
  function setState(key, value) {
    STATE[key] = value;
    if (key === 'power') {
      updatePowerUI();
    }
    if (key === 'theme') {
      document.body.setAttribute('data-theme', value);
      updatePhosphorModeButtons();
    }
  }

  function updatePowerUI() {
    const pw = STATE.power;
    elPower.dataset.state = pw === 'off' ? 'off' : (pw === 'standby' ? 'standby' : 'on');

    if (pw === 'off') {
      elPowerToggle.style.transform = 'translateY(2px)';
      elPowerLed.classList.remove('on');
      elScreen.style.opacity = '0.05';
      elScanlines.style.opacity = '0';
      elFlicker.style.opacity = '0';
      elAmbient.style.opacity = '0';
      $$('.led').forEach(l => l.classList.remove('active'));
      $$('.window').forEach(w => w.style.opacity = '0.15');
      $$('.transport-btn').forEach(b => b.disabled = true);
      elConsoleIn.disabled = true;
    } else if (pw === 'standby') {
      elPowerToggle.style.transform = 'translateY(2px)';
      elPowerLed.classList.remove('on');
      elScreen.style.opacity = '0.15';
      elScanlines.style.opacity = '0.3';
      elFlicker.style.opacity = '0';
      elAmbient.style.opacity = '0.2';
      $$('.window').forEach(w => w.style.opacity = '0.3');
      $$('.transport-btn').forEach(b => b.disabled = true);
      elConsoleIn.disabled = true;
    } else {
      elPowerToggle.style.transform = 'translateY(18px)';
      elPowerLed.classList.add('on');
      elScreen.style.opacity = '1';
      elScreen.style.filter = '';
      elScanlines.style.opacity = '1';
      elFlicker.style.opacity = '0.03';
      elAmbient.style.opacity = '1';
      $$('.window').forEach(w => w.style.opacity = '1');
      $$('.transport-btn').forEach(b => b.disabled = false);
      elConsoleIn.disabled = false;
    }
  }

  elPower.addEventListener('click', () => {
    if (STATE.power === 'off') {
      setState('power', 'standby');
      triggerLedPulse('led-cpu');
      appendTapeLine('▸ SYSTEM ENTERING STANDBY MODE...', 'warn-msg');
    } else if (STATE.power === 'standby') {
      boot();
    } else {
      setState('power', 'off');
      appendTapeLine('▸ SYSTEM SHUTDOWN INITIATED...', 'warn-msg');
      setTimeout(() => appendTapeLine('▸ BYE.', 'sys-msg'), 1200);
    }
  });

  /* ===== TOGGLE SWITCHES ===== */
  $$('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      if (STATE.power !== 'on') return;
      const isActive = sw.classList.toggle('active');
      const statusEl = sw.parentElement.querySelector('.toggle-status');
      statusEl.textContent = isActive ? 'ON' : 'OFF';
      statusEl.className = 'toggle-status ' + (isActive ? 'on' : 'off');

      const swId = sw.id;
      if (swId === 'sw-main') {
        triggerLedPulse('led-cpu');
      }
      if (sw.dataset.switch === 'net') {
        if (isActive) {
          triggerLedPulse('led-net');
          appendTapeLine('▸ NETWORK BUS ENABLED — LINK ACTIVE', 'ok-msg');
        } else {
          appendTapeLine('⚠ NETWORK BUS DISABLED', 'warn-msg');
        }
      }
      if (sw.dataset.switch === 'aux') {
        if (isActive) {
          triggerLedPulse('led-cpu');
          appendTapeLine('▸ AUXILIARY BUS POWERED ON', 'sys-msg');
        }
      }
      if (sw.dataset.switch === 'fan') {
        appendTapeLine(isActive ? '▸ COOLING FAN ENGAGED' : '⚠ COOLING FAN OFF — THERMAL WARNING', isActive ? 'sys-msg' : 'warn-msg');
      }
    });
  });

  /* ===== ROTARY DIAL ===== */
  (function initRotaryDial() {
    const dial = $('#rotary-dial');
    const pointer = $('.dial-pointer');
    const readout = $('#channel-readout');
    let currentAngle = -15; // default position
    let currentNumber = 0;
    const ANGLE_STEP = 30;
    const NUMBERS = 10;

    // Angle per number = 300 / 10 = 30 degrees
    // Start at -15 (between 0 and 9 area), default points to 0-ish

    function setDialNumber(num) {
      currentNumber = Math.max(0, Math.min(9, num));
      currentAngle = -15 + currentNumber * ANGLE_STEP;
      pointer.style.transform = `rotate(${currentAngle}deg)`;
      readout.textContent = currentNumber;
    }

    let dragging = false;
    let startAngle = 0;
    let startNumber = 0;

    function getAngleFromCenter(e) {
      const rect = dial.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    }

    dial.addEventListener('mousedown', (e) => {
      if (STATE.power !== 'on') return;
      dragging = true;
      startAngle = getAngleFromCenter(e);
      startNumber = currentNumber;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const angle = getAngleFromCenter(e);
      let diff = angle - startAngle;
      // Handle wrap-around
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const delta = Math.round(diff / ANGLE_STEP);
      setDialNumber(startNumber + delta);
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      // Snap to nearest number
      setDialNumber(currentNumber);
      triggerLedPulse('led-cpu');
      appendTapeLine(`▸ CHANNEL SELECTED: ${currentNumber}`, 'data-msg');
    });

    // Click on finger stop to dial
    $('.dial-finger-stop').addEventListener('click', () => {
      if (STATE.power !== 'on') return;
      triggerLedPulse('led-cpu');
      appendTapeLine(`▸ DIALING CHANNEL ${currentNumber}...`, 'data-msg');
      // Slight bounce animation
      pointer.style.transition = 'transform 0.05s';
      pointer.style.transform = `rotate(${currentAngle - 15}deg)`;
      setTimeout(() => {
        pointer.style.transition = 'transform 0.4s cubic-bezier(0.17, 0.67, 0.29, 1.4)';
        pointer.style.transform = `rotate(${currentAngle}deg)`;
      }, 60);
    });

    // Initial number
    setDialNumber(0);
  })();

  /* ===== ANALOG KNOBS ===== */
  (function initKnobs() {
    $$('.analog-knob').forEach(knob => {
      const indicator = knob.querySelector('.knob-indicator');
      const knobId = knob.id;
      let value = 0; // degrees offset from center

      function updateKnobUI() {
        indicator.style.transform = `rotate(${value - 135}deg)`;
        // Update state
        if (knobId === 'knob-brt') STATE.knBrt = Math.round(((value + 135) / 270) * 100);
        if (knobId === 'knob-contrast') STATE.knCont = Math.round(((value + 135) / 270) * 100);
        if (knobId === 'knob-volume') {
          STATE.knVol = Math.round(((value + 135) / 270) * 100);
          elVolFill.style.width = STATE.knVol + '%';
          const thumbPos = 2 + (STATE.knVol / 100) * 56;
          elVolThumb.style.left = thumbPos + 'px';
        }
      }

      let dragging = false;
      let startAngle = 0;
      let startValue = 0;

      function getAngle(e) {
        const rect = knob.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      }

      knob.addEventListener('mousedown', (e) => {
        if (STATE.power !== 'on') return;
        dragging = true;
        startAngle = getAngle(e);
        startValue = value;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const angle = getAngle(e);
        let diff = angle - startAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        value = Math.max(-135, Math.min(135, startValue + diff));
        updateKnobUI();
      });

      window.addEventListener('mouseup', () => {
        dragging = false;
      });

      // Also support click for quick adjustments
      knob.addEventListener('click', (e) => {
        if (dragging || STATE.power !== 'on') return;
        // Click right side to increase, left to decrease
        const rect = knob.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        value = Math.max(-135, Math.min(135, value + (e.clientX > cx ? 15 : -15)));
        updateKnobUI();
        triggerLedPulse('led-cpu');
      });

      updateKnobUI();
    });
  })();

  /* ===== PHOSPHOR MODE ===== */
  const modeBtns = $$('.mode-btn');
  function updatePhosphorModeButtons() {
    modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === STATE.theme);
    });
  }
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setState('theme', btn.dataset.mode);
      triggerLedPulse('led-cpu');
      appendTapeLine(`▸ DISPLAY MODE: ${btn.dataset.mode.toUpperCase()} PHOSPHOR`, 'data-msg');
    });
  });

  /* ===== TAPE DRIVE ===== */
  function updateTapeUI() {
    const pos = STATE.tapePosition;
    elTapeProgressFill.style.width = pos + '%';
    elTapeProgressHead.style.left = `calc(${pos}% - 1px)`;
    elTapePct.textContent = Math.round(pos) + '%';

    const posStr = String(Math.round(pos * 500)).padStart(6, '0');
    const totalStr = '003000';
    elTapePositionEl.textContent = `${posStr} / ${totalStr}`;
  }

  const elTapePositionEl = $('#tape-position');

  function setTapeState(running, direction) {
    STATE.tapeRunning = running;
    STATE.tapeDirection = direction;

    const leftReel = $('#reel-left');
    const rightReel = $('#reel-right');

    leftReel.classList.remove('spinning', 'spinning-reverse');
    rightReel.classList.remove('spinning', 'spinning-reverse');
    elTapeStrip.style.animation = 'none';

    if (running) {
      if (direction === 'fwd') {
        rightReel.classList.add('spinning');
        leftReel.classList.add('spinning-reverse');
        elTapeStrip.style.animation = 'tape-feed 0.3s linear infinite';
        elTapeStatus.textContent = '▶ FORWARD';
        elTapeStatus.style.color = 'var(--phosphor-primary)';
      } else if (direction === 'rew') {
        leftReel.classList.add('spinning');
        rightReel.classList.add('spinning-reverse');
        elTapeStrip.style.animation = 'tape-feed 0.3s linear reverse infinite';
        elTapeStatus.textContent = '◀ REWIND';
        elTapeStatus.style.color = '#ffaa44';
      }
    } else {
      elTapeStatus.textContent = 'READY';
      elTapeStatus.style.color = 'var(--text-primary)';
    }

    // Update button states
    $$('.transport-btn').forEach(b => b.classList.remove('active'));
    if (running) {
      if (direction === 'fwd') $('#btn-play').classList.add('active');
      if (direction === 'rew') $('#btn-rewind').classList.add('active');
    }
  }

  function tapeAutoAdvance() {
    if (!STATE.tapeRunning) return;
    const step = STATE.tapeDirection === 'fwd' ? 0.5 : -0.5;
    STATE.tapePosition = Math.max(0, Math.min(100, STATE.tapePosition + step));
    updateTapeUI();

    // Auto-stop at ends
    if (STATE.tapePosition >= 100 || STATE.tapePosition <= 0) {
      setTapeState(false, null);
      appendTapeLine(`▸ TAPE ${STATE.tapePosition >= 100 ? 'END' : 'BEGINNING'} REACHED — AUTO STOP`, 'warn-msg');
      triggerLedPulse('led-disk');
    }
  }

  // Transport buttons
  $('#btn-play').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    if (STATE.tapeRunning && STATE.tapeDirection === 'fwd') {
      setTapeState(false, null);
      appendTapeLine('▸ TAPE STOPPED AT ' + Math.round(STATE.tapePosition) + '%', 'sys-msg');
    } else {
      setTapeState(true, 'fwd');
      appendTapeLine('▸ TAPE FORWARD — PLAYBACK INITIATED', 'ok-msg');
      triggerLedPulse('led-disk');
    }
  });

  $('#btn-stop').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    setTapeState(false, null);
    appendTapeLine('▸ TAPE STOPPED', 'sys-msg');
  });

  $('#btn-rewind').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    if (STATE.tapeRunning && STATE.tapeDirection === 'rew') {
      setTapeState(false, null);
      appendTapeLine('▸ REWIND STOPPED AT ' + Math.round(STATE.tapePosition) + '%', 'sys-msg');
    } else {
      setTapeState(true, 'rew');
      appendTapeLine('▸ TAPE REWIND — REVERSING...', 'warn-msg');
      triggerLedPulse('led-disk');
    }
  });

  $('#btn-fastfwd').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    // Fast forward: jump position by 10%
    STATE.tapePosition = Math.min(100, STATE.tapePosition + 10);
    updateTapeUI();
    triggerLedPulse('led-disk');
    appendTapeLine('▸ FAST FORWARD — POSITION: ' + Math.round(STATE.tapePosition) + '%', 'data-msg');
  });

  $('#btn-record').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    triggerLedPulse('led-cpu');
    triggerLedPulse('led-disk');
    appendTapeLine('▸ RECORD MODE — AWAITING DATA STREAM...', 'warn-msg');
    showToast('RECORD MODE ACTIVE — TYPE TO LOG');
    elConsoleIn.focus();
  });

  $('#btn-eject').addEventListener('click', () => {
    if (STATE.power !== 'on') return;
    setTapeState(false, null);
    triggerLedPulse('led-disk');
    // Eject animation
    elTapeLeft.style.borderStyle = 'dashed';
    elTapeRight.querySelector('.tape-on-reel').style.opacity = '0.2';
    appendTapeLine('⚠ TAPE EJECTED — INSERT NEW VOLUME', 'warn-msg');
    showToast('TAPE EJECTED — INSERT NEW MEDIA');
    setTimeout(() => {
      elTapeLeft.style.borderStyle = 'solid';
      elTapeRight.querySelector('.tape-on-reel').style.opacity = '0.7';
    }, 3000);
  });

  setInterval(tapeAutoAdvance, 200);
  updateTapeUI();

  /* ===== VOLUME SLIDER ===== */
  (function initVolumeSlider() {
    const track = $('.slider-track');
    let dragging = false;

    function setVolumeFromX(clientX) {
      const rect = track.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      STATE.knVol = Math.round(pct * 100);
      elVolFill.style.width = STATE.knVol + '%';
      elVolThumb.style.left = (2 + pct * 56) + 'px';
    }

    track.addEventListener('mousedown', (e) => {
      if (STATE.power !== 'on') return;
      dragging = true;
      setVolumeFromX(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      setVolumeFromX(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
    });
  })();

  /* ===== FILE MANAGER ===== */
  (function initFileManager() {
    // Tab switching
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (STATE.power !== 'on') return;
        $$('.tab').forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');
        STATE.currentTab = tab.dataset.tab;
        triggerLedPulse('led-disk');
        appendTapeLine(`▸ FILE MANAGER TAB: ${STATE.currentTab.toUpperCase()}`, 'sys-msg');
      });
    });

    // File selection
    $$('.file-entry').forEach(entry => {
      entry.addEventListener('click', () => {
        if (STATE.power !== 'on') return;
        $$('.file-entry').forEach(e => e.classList.remove('selected'));
        entry.classList.add('selected');
        const name = entry.querySelector('.file-name').textContent;
        const size = entry.querySelector('.file-size').textContent;
        STATE.selectedFile = name;
        triggerLedPulse('led-disk');
        appendTapeLine(`▸ SELECTED: ${name}  SIZE: ${size}`, 'data-msg');
      });

      entry.addEventListener('dblclick', () => {
        if (STATE.power !== 'on') return;
        const name = entry.querySelector('.file-name').textContent;
        const icon = entry.querySelector('.file-icon').textContent;
        if (icon === '📂') {
          appendTapeLine(`▸ OPENING DIRECTORY: ${name}...`, 'data-msg');
          showToast(`DIRECTORY: ${name} — 4 ENTRIES`);
        } else {
          appendTapeLine(`▸ EXECUTING: ${name}`, 'ok-msg');
          triggerLedPulse('led-cpu');
          triggerLedPulse('led-cpu');
          showToast(`EXECUTING: ${name}`);
        }
      });
    });
  })();

  /* ===== PATCH BAY ===== */
  (function initPatchBay() {
    $$('.patch-jack').forEach(jack => {
      jack.addEventListener('click', () => {
        if (STATE.power !== 'on') return;
        const isConnected = jack.classList.toggle('connected');
        triggerLedPulse('led-cpu');
        const label = jack.closest('.patch-row').querySelector('.patch-label').textContent;
        appendTapeLine(
          isConnected
            ? `▸ PATCH CONNECTED: ${label}`
            : `▸ PATCH DISCONNECTED: ${label}`,
          isConnected ? 'ok-msg' : 'warn-msg'
        );
      });
    });
  })();

  /* ===== WINDOW MANAGEMENT ===== */
  (function initWindows() {
    $$('.window').forEach(win => {
      const titlebar = win.querySelector('.window-titlebar');
      let dragging = false;
      let offsetX, offsetY;
      let startX, startY, startLeft, startTop;
      let isResizing = false;
      const resizeHandle = win.querySelector('.window-resize-handle');

      // Drag
      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('ctrl-dot')) return;
        if (STATE.power === 'off') return;
        dragging = true;
        win.style.zIndex = 50;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const parentRect = elDesktop.getBoundingClientRect();
        let newX = e.clientX - parentRect.left - offsetX;
        let newY = e.clientY - parentRect.top - offsetY;
        newX = Math.max(0, Math.min(parentRect.width - win.offsetWidth, newX));
        newY = Math.max(0, Math.min(parentRect.height - win.offsetHeight, newY));
        win.style.left = newX + 'px';
        win.style.top = newY + 'px';
        win.style.setProperty('--win-x', newX / parentRect.width * 100 + '%');
        win.style.setProperty('--win-y', newY / parentRect.height * 100 + '%');
      });

      window.addEventListener('mouseup', () => {
        dragging = false;
      });

      // Titlebar buttons
      titlebar.addEventListener('click', (e) => {
        if (e.target.classList.contains('ctrl-close')) {
          win.style.transition = 'opacity 0.3s, transform 0.3s';
          win.style.opacity = '0';
          win.style.transform = 'scale(0.9)';
          setTimeout(() => {
            win.style.display = 'none';
            win.style.transition = '';
            win.style.transform = '';
          }, 300);
        }
        if (e.target.classList.contains('ctrl-min')) {
          win.style.transition = 'opacity 0.3s, transform 0.3s';
          win.style.opacity = '0.15';
          win.style.pointerEvents = 'none';
        }
        if (e.target.classList.contains('ctrl-max')) {
          if (win.classList.toggle('window-maximized')) {
            win.style.position = 'fixed';
            win.style.left = '50%';
            win.style.top = '50%';
            win.style.transform = 'translate(-50%, -50%)';
            win.style.width = '90%';
            win.style.height = '80%';
            win.style.maxWidth = 'none';
            win.style.maxHeight = 'none';
          } else {
            win.style.position = 'absolute';
            win.style.transform = '';
            win.style.width = '';
            win.style.height = '';
            win.style.maxWidth = '';
            win.style.maxHeight = '';
          }
        }
      });

      // Resize handle
      if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
          if (STATE.power === 'off') return;
          isResizing = true;
          e.preventDefault();
          e.stopPropagation();
        });
      }
    });

    window.addEventListener('mousemove', (e) => {
      $$('.window').forEach(win => {
        const handle = win.querySelector('.window-resize-handle');
        if (!handle) return;
        if (isResizing) {
          // Not implementing resize for brevity but the handle is there
        }
      });
    });

    window.addEventListener('mouseup', () => {
      isResizing = false;
    });
  })();

  /* ===== TERMINAL / CONSOLE ===== */
  (function initTerminal() {
    const commands = {
      help: () => {
        appendTapeLine('┌── KRONOS COMMAND REFERENCE ──┐', 'data-msg');
        appendTapeLine('│  HELP       - THIS SCREEN     │', 'sys-msg');
        appendTapeLine('│  DIR        - LIST FILES      │', 'sys-msg');
        appendTapeLine('│  STATUS     - SYSTEM STATUS   │', 'sys-msg');
        appendTapeLine('│  DATE       - SYSTEM DATE     │', 'sys-msg');
        appendTapeLine('│  MEMORY     - MEMORY MAP      │', 'sys-msg');
        appendTapeLine('│  CLEAR      - CLEAR SCREEN    │', 'sys-msg');
        appendTapeLine('│  RUN <file> - EXECUTE PROGRAM │', 'data-msg');
        appendTapeLine('│  COPY/DEL   - FILE OPERATIONS │', 'data-msg');
        appendTapeLine('│  VERIFY     - DISK VERIFY     │', 'sys-msg');
        appendTapeLine('│  HALT       - SHUTDOWN        │', 'warn-msg');
        appendTapeLine('└───────────────────────────────┘', 'data-msg');
      },
      dir: () => {
        appendTapeLine('┌── DIRECTORY LISTING ─────────┐', 'data-msg');
        appendTapeLine('│ SYSTEM_ROOT/    [DIR]         │', 'sys-msg');
        appendTapeLine('│ AUTOCALC.EXE    42.7K         │', 'ok-msg');
        appendTapeLine('│ CENSUS_DATA.BLK 1.2M          │', 'data-msg');
        appendTapeLine('│ THERMALMAP.PRG  87.3K         │', 'sys-msg');
        appendTapeLine('│ ARCHIVE_78/     [DIR]         │', 'sys-msg');
        appendTapeLine('│ NAV_STARS.DAT   256K          │', 'data-msg');
        appendTapeLine('│ SYNTH_DRv2.BIN  12.4K         │', 'ok-msg');
        appendTapeLine('│ WEATHER_GRID.GR 3.8M          │', 'data-msg');
        appendTapeLine('│ COMMS_TERM.TSK  203K          │', 'sys-msg');
        appendTapeLine('│ PERSONNEL.CIF   64K           │', 'data-msg');
        appendTapeLine('└───────────────────────────────┘', 'data-msg');
        triggerLedPulse('led-disk');
      },
      status: () => {
        appendTapeLine('┌── SYSTEM STATUS ──────────────┐', 'data-msg');
        appendTapeLine(`│ POWER:    ${STATE.power.toUpperCase().padEnd(10)}│`, STATE.power === 'on' ? 'ok-msg' : 'warn-msg');
        appendTapeLine(`│ CPU LOAD: ${STATE.cpuLoad}%${' '.repeat(10 - String(STATE.cpuLoad).length)}│`, 'sys-msg');
        appendTapeLine(`│ MEM USAGE: ${STATE.memUsage}%${' '.repeat(9 - String(STATE.memUsage).length)}│`, 'sys-msg');
        appendTapeLine(`│ NET I/O:   ${STATE.netIO}%${' '.repeat(10 - String(STATE.netIO).length)}│`, 'sys-msg');
        appendTapeLine(`│ THEME:     ${STATE.theme.toUpperCase().padEnd(10)}│`, 'data-msg');
        appendTapeLine(`│ TAPE POS:  ${Math.round(STATE.tapePosition)}%${' '.repeat(11 - String(Math.round(STATE.tapePosition)).length)}│`, 'sys-msg');
        appendTapeLine(`│ CHANNEL:   ${STATE.channel}${' '.repeat(11 - String(STATE.channel).length)}│`, 'sys-msg');
        appendTapeLine('└───────────────────────────────┘', 'data-msg');
        triggerLedPulse('led-cpu');
      },
      date: () => {
        const now = new Date();
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        const d = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
        const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        appendTapeLine(`▸ SYSTEM DATE: ${d}`, 'data-msg');
        appendTapeLine(`▸ SYSTEM TIME: ${t}`, 'data-msg');
      },
      memory: () => {
        appendTapeLine('┌── MEMORY MAP (64K) ──────────┐', 'data-msg');
        appendTapeLine('│ $0000-$0FFF: SYSTEM ROM       │', 'sys-msg');
        appendTapeLine('│ $1000-$4FFF: KERNEL RAM       │', 'ok-msg');
        appendTapeLine('│ $5000-$7FFF: USER WORKSPACE   │', 'data-msg');
        appendTapeLine('│ $8000-$8FFF: VIDEO BUFFER      │', 'sys-msg');
        appendTapeLine('│ $9000-$9FFF: I/O BUFFERS       │', 'sys-msg');
        appendTapeLine('│ $A000-$FFFF: UNUSED           │', 'warn-msg');
        appendTapeLine('└───────────────────────────────┘', 'data-msg');
        triggerLedPulse('led-cpu');
      },
      clear: () => {
        elTicker.innerHTML = '';
        appendTapeLine('▸ SCREEN CLEARED', 'sys-msg');
      },
      verify: () => {
        appendTapeLine('▸ INITIATING DISK VERIFY...', 'data-msg');
        setTimeout(() => appendTapeLine('✓ VOLUME KRONOS$DATA_VOL_07 VERIFIED — NO ERRORS', 'ok-msg'), 1500);
        setTimeout(() => appendTapeLine('▸ 47 FILES CHECKED — 0 BAD SECTORS', 'ok-msg'), 3000);
        triggerLedPulse('led-disk');
        triggerLedPulse('led-cpu');
      },
      halt: () => {
        appendTapeLine('⚠ SYSTEM HALT INITIATED...', 'warn-msg');
        appendTapeLine('▸ SAVING STATE TO TAPE...', 'sys-msg');
        setTimeout(() => {
          setState('power', 'off');
          appendTapeLine('▸ GOODBYE, TECHNICIAN_7', 'sys-msg');
        }, 2000);
      },
    };

    elConsoleIn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = elConsoleIn.value.trim();
        if (!raw) return;

        // Display command
        appendTapeLine(`> ${raw}`, 'user-msg');
        STATE.commandHistory.unshift(raw);
        STATE.historyIndex = -1;

        // Parse
        const parts = raw.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        triggerLedPulse('led-cpu');

        if (commands[cmd]) {
          commands[cmd]();
        } else if (cmd === 'run') {
          if (!args) {
            appendTapeLine('? MISSING FILENAME — USAGE: RUN <file>', 'warn-msg');
          } else {
            appendTapeLine(`▸ LOADING ${args}...`, 'data-msg');
            setTimeout(() => {
              appendTapeLine(`✓ PROGRAM ${args} LOADED — EXECUTING`, 'ok-msg');
              triggerLedPulse('led-cpu');
              triggerLedPulse('led-cpu');
            }, 800);
          }
        } else if (cmd === 'copy') {
          appendTapeLine(`▸ COPY OPERATION: ${args || 'NO TARGET SPECIFIED'}`, 'data-msg');
          setTimeout(() => appendTapeLine('✓ FILE COPIED TO TAPE BUFFER', 'ok-msg'), 1200);
          triggerLedPulse('led-disk');
        } else if (cmd === 'del') {
          appendTapeLine(`▸ DELETE: ${args || 'NO FILE SPECIFIED'}`, 'warn-msg');
          setTimeout(() => appendTapeLine('✓ FILE DELETED', 'sys-msg'), 600);
          triggerLedPulse('led-disk');
        } else if (cmd === 'load') {
          appendTapeLine(`▸ LOADING FROM TAPE: ${args || 'VOLUME'}`, 'data-msg');
          setTapeState(true, 'fwd');
          setTimeout(() => {
            setTapeState(false, null);
            appendTapeLine('✓ LOAD COMPLETE', 'ok-msg');
          }, 3000);
        } else if (cmd === 'save') {
          appendTapeLine(`▸ SAVING TO TAPE: ${args || 'VOLUME'}`, 'data-msg');
          setTapeState(true, 'fwd');
          setTimeout(() => {
            setTapeState(false, null);
            appendTapeLine('✓ SAVE COMPLETE — VERIFY PASS', 'ok-msg');
          }, 2500);
        } else if (raw.toLowerCase() === 'easter egg') {
          // Easter egg!
          for (let i = 0; i < 15; i++) {
            setTimeout(() => {
              appendTapeLine('█▓░ ✦ DATA STREAM ✦ ░▓█', ['ok-msg', 'data-msg', 'sys-msg', 'warn-msg'][i % 4]);
            }, i * 100);
          }
          triggerLedPulse('led-cpu');
          triggerLedPulse('led-net');
          triggerLedPulse('led-disk');
          showToast('✦ EASTER EGG FOUND ✦');
        } else {
          appendTapeLine(`? UNKNOWN COMMAND: ${cmd} — TYPE "HELP" FOR COMMANDS`, 'warn-msg');
        }

        elConsoleIn.value = '';
      }

      // Command history navigation
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (STATE.historyIndex < STATE.commandHistory.length - 1) {
          STATE.historyIndex++;
          elConsoleIn.value = STATE.commandHistory[STATE.historyIndex];
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (STATE.historyIndex > 0) {
          STATE.historyIndex--;
          elConsoleIn.value = STATE.commandHistory[STATE.historyIndex];
        } else {
          STATE.historyIndex = -1;
          elConsoleIn.value = '';
        }
      }
    });
  })();

  /* ===== FLIP CLOCK ===== */
  (function initFlipClock() {
    const digits = {
      h1: $('#flip-h1'), h2: $('#flip-h2'),
      m1: $('#flip-m1'), m2: $('#flip-m2'),
      s1: $('#flip-s1'), s2: $('#flip-s2'),
    };

    function flipDigit(el, newNum) {
      const top = el.querySelector('.flip-top');
      const bottom = el.querySelector('.flip-bottom');
      if (top.textContent === newNum) return;

      // Top half flips out
      top.textContent = newNum;
      top.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.2, 0.4, 1)';
      top.style.transform = 'rotateX(90deg)';

      setTimeout(() => {
        bottom.textContent = newNum;
        bottom.style.transition = 'none';
        bottom.style.transform = 'rotateX(-90deg)';
        // Force reflow
        bottom.offsetHeight;
        bottom.style.transition = 'transform 0.25s cubic-bezier(0.4, 0.2, 0.4, 1)';
        bottom.style.transform = 'rotateX(0deg)';

        setTimeout(() => {
          top.style.transition = 'none';
          top.style.transform = 'rotateX(0deg)';
          top.textContent = newNum;
        }, 260);
      }, 250);
    }

    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      flipDigit(digits.h1, h[0]);
      flipDigit(digits.h2, h[1]);
      flipDigit(digits.m1, m[0]);
      flipDigit(digits.m2, m[1]);
      flipDigit(digits.s1, s[0]);
      flipDigit(digits.s2, s[1]);

      // Time in ticker
      elTickerTime.textContent = `${h}:${m}:${s}`;

      // Date
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
      $('#digital-date').textContent = '▸ ' + dateStr;
    }

    // Initial call
    updateClock();
    setInterval(updateClock, 1000);
  })();

  /* ===== UPTIME COUNTER ===== */
  setInterval(() => {
    STATE.uptimeSeconds++;
    const h = Math.floor(STATE.uptimeSeconds / 3600);
    const m = Math.floor((STATE.uptimeSeconds % 3600) / 60);
    const s = STATE.uptimeSeconds % 60;
    const el = $('#digital-uptime');
    if (el) el.textContent = `UPTIME: ${String(h).padStart(3, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, 1000);

  /* ===== VU METERS SIMULATION ===== */
  setInterval(() => {
    if (STATE.power !== 'on') return;

    // Fluctuate values slightly
    STATE.cpuLoad = Math.max(5, Math.min(95, STATE.cpuLoad + Math.round((Math.random() - 0.48) * 8)));
    STATE.memUsage = Math.max(10, Math.min(95, STATE.memUsage + Math.round((Math.random() - 0.49) * 3)));
    STATE.netIO = Math.max(2, Math.min(90, STATE.netIO + Math.round((Math.random() - 0.48) * 10)));

    $('#vu-cpu').style.setProperty('--level', STATE.cpuLoad + '%');
    $('#vu-mem').style.setProperty('--level', STATE.memUsage + '%');
    $('#vu-net').style.setProperty('--level', STATE.netIO + '%');

    // Update peak markers
    ['cpu', 'mem', 'net'].forEach(m => {
      const fill = $(`#vu-${m}`);
      const peak = $(`#vu-${m}-peak`);
      const level = m === 'cpu' ? STATE.cpuLoad : m === 'mem' ? STATE.memUsage : STATE.netIO;
      if (level > parseInt(peak.dataset.peak || 0)) {
        peak.dataset.peak = level;
        peak.style.right = `calc(100% - ${level}% - 1px)`;
      }
      // Gradually lower peak
      if (parseInt(peak.dataset.peak || 0) > level + 2) {
        peak.dataset.peak = parseInt(peak.dataset.peak) - 1;
        peak.style.right = `calc(100% - ${peak.dataset.peak}% - 1px)`;
      }
    });
  }, 1500);

  /* ===== CRT AMBIENT GLOW PULSE ===== */
  (function ambientPulse() {
    function pulse() {
      if (STATE.power !== 'on') return;
      const intensity = 0.06 + Math.random() * 0.08;
      elAmbient.style.opacity = intensity;
      setTimeout(pulse, 2000 + Math.random() * 3000);
    }
    setTimeout(pulse, 1000);
  })();

  /* ===== TOAST SYSTEM ===== */
  let toastTimeout;
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ===== KEYBOARD SHORTCUTS ===== */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') e.target.blur();
      return;
    }

    switch (e.key) {
      case 'F1':
        e.preventDefault();
        commands.help();
        showToast('COMMAND REFERENCE DISPLAYED');
        break;
      case 'F2':
        e.preventDefault();
        const modes = ['amber', 'green', 'blue', 'white'];
        const idx = modes.indexOf(STATE.theme);
        const next = modes[(idx + 1) % modes.length];
        setState('theme', next);
        showToast(`PHOSPHOR MODE: ${next.toUpperCase()}`);
        break;
      case 'F5':
        e.preventDefault();
        if (STATE.power === 'on') {
          appendTapeLine('▸ SYSTEM REFRESH — RE-INDEXING FILES...', 'sys-msg');
          triggerLedPulse('led-disk');
          setTimeout(() => appendTapeLine(`✓ ${12 + Math.floor(Math.random() * 5)} FILES INDEXED`, 'ok-msg'), 1000);
          showToast('SYSTEM REFRESHED');
        }
        break;
      case 'Escape':
        // Close any open modal or return from mode
        break;
      case ' ':
        // Prevent space from scrolling
        e.preventDefault();
        break;
    }
  });

  /* ===== CLICK ON DESKTOP TO DESELECT ===== */
  elDesktop.addEventListener('click', (e) => {
    if (e.target === elDesktop) {
      $$('.file-entry').forEach(e => e.classList.remove('selected'));
      STATE.selectedFile = null;
    }
  });

  /* ===== INITIALIZE ===== */
  // Start in standby mode
  setState('power', 'off');
  updatePhosphorModeButtons();
  updateTapeUI();

})();
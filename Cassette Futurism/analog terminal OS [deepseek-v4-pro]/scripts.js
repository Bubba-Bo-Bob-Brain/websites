(function() {
  'use strict';

  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');
  const bloomToggle = document.getElementById('bloomToggle');
  const powerToggle = document.getElementById('powerToggle');
  const rotaryKnob = document.getElementById('rotaryKnob');
  const fileList = document.getElementById('fileList');
  const filePreview = document.getElementById('filePreview');
  const previewHeader = filePreview.querySelector('.preview-header');
  const previewContent = filePreview.querySelector('.preview-content');
  const chronoDisplay = document.querySelector('.chrono-digit');
  const tickerText = document.querySelector('.ticker-text');
  const cassetteOverlay = document.getElementById('cassetteOverlay');
  const cassetteStatus = document.getElementById('cassetteStatus');
  const vuFillA = document.querySelector('#vuMeterA .vu-fill');
  const vuFillB = document.querySelector('#vuMeterB .vu-fill');
  const headerTape = document.getElementById('header-tape');

  let currentAngle = 0;
  let isDragging = false;
  let lastMouseY = 0;
  let selectedFileIndex = 0;
  let cassetteTimer = null;
  let vuInterval = null;

  const fileEntries = [
    { name: 'TELEMETRY_DATA', type: 'dir', size: '4.2K', date: '12-MAR-79', lines: ['SYS: NOMINAL', 'TEMP: 23.4 C', 'ALT: 412 KM', 'VEL: 7.66 KM/S'] },
    { name: 'ORBIT_CALC.EXE', type: 'exec', size: '18K', date: '03-FEB-79', lines: ['EXECUTING ORBIT_CALC...', 'PERIAPSIS: 210 KM', 'APOAPSIS: 450 KM', 'INCLINATION: 51.6°'] },
    { name: 'MISSION_LOG.TXT', type: 'txt', size: '2.1K', date: '22-JAN-79', lines: ['LOG ENTRY 47:', 'ALL SYSTEMS GO.', 'CREW STATUS NOMINAL.', 'NEXT BURN: T+12:30'] },
    { name: 'SYSTEM_IMAGES', type: 'dir', size: '32K', date: '15-NOV-78', lines: ['IMG_001.RAW', 'IMG_002.RAW', 'IMG_003.RAW', 'THUMBNAIL.IDX'] },
    { name: 'NAV_COMP.EXE', type: 'exec', size: '27K', date: '09-OCT-78', lines: ['NAV COMPILER v2.1', 'STAR CATALOG LOADED', 'GYRO CALIBRATION OK', 'READY FOR INPUT'] },
    { name: 'STAR_CHART.DAT', type: 'txt', size: '56K', date: '01-AUG-78', lines: ['ALPHA CENTAURI', 'SIRIUS A', 'BETELGEUSE', 'PROCYON'] }
  ];

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (chronoDisplay) {
      chronoDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }

  function updateTickerMessage() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const baseMessages = [
      'OMNISYSTEM READY · DRIVE A MOUNTED · 23 FILES INDEXED',
      'STANDBY FOR INPUT · LAST COMMAND: DIR /A',
      'CASSETTE DRIVE IDLE · PERIPHERALS NOMINAL',
      'VOL: OMNI-01 · FREE SPACE 14.2K',
      'NEXT SCHEDULED MAINTENANCE: 15-APR-79'
    ];
    const randomMsg = baseMessages[Math.floor(Math.random() * baseMessages.length)];
    if (tickerText) {
      tickerText.textContent = `${randomMsg} · SYSTEM TIME ${timeStr} GMT · READY >`;
    }
  }

  function updateVUMeters() {
    if (vuFillA && vuFillB) {
      const levelA = 40 + Math.random() * 50;
      const levelB = 25 + Math.random() * 55;
      vuFillA.style.height = `${levelA}%`;
      vuFillB.style.height = `${levelB}%`;
    }
  }

  function selectFile(index) {
    const entries = document.querySelectorAll('.file-entry');
    entries.forEach((entry, i) => {
      if (i === index) {
        entry.classList.add('selected');
      } else {
        entry.classList.remove('selected');
      }
    });
    selectedFileIndex = index;
    updatePreview(index);
  }

  function updatePreview(index) {
    const file = fileEntries[index];
    if (!file || !previewHeader || !previewContent) return;
    previewHeader.textContent = `PREVIEW: ${file.name}`;
    previewContent.innerHTML = '';
    file.lines.forEach(line => {
      const div = document.createElement('div');
      div.className = 'preview-line';
      div.textContent = line;
      previewContent.appendChild(div);
    });
  }

  function showCassetteAnimation(operationName, duration = 1800) {
    if (!cassetteOverlay || !cassetteStatus) return;
    cassetteOverlay.classList.add('active');
    cassetteStatus.textContent = `${operationName}...`;
    if (cassetteTimer) clearTimeout(cassetteTimer);
    cassetteTimer = setTimeout(() => {
      cassetteOverlay.classList.remove('active');
      cassetteTimer = null;
    }, duration);
  }

  function handleRotaryDragStart(e) {
    e.preventDefault();
    isDragging = true;
    lastMouseY = e.clientY || (e.touches && e.touches[0].clientY) || lastMouseY;
    rotaryKnob.style.cursor = 'grabbing';
  }

  function handleRotaryDragMove(e) {
    if (!isDragging) return;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientY) return;
    const delta = lastMouseY - clientY;
    if (Math.abs(delta) > 2) {
      currentAngle += delta * 0.8;
      rotaryKnob.style.transform = `rotate(${currentAngle}deg)`;
      lastMouseY = clientY;
      const normalizedAngle = ((currentAngle % 360) + 360) % 360;
      const segment = Math.floor(normalizedAngle / 45) % 8;
      const entriesCount = document.querySelectorAll('.file-entry').length;
      const mappedIndex = Math.floor((segment / 8) * entriesCount) % entriesCount;
      if (mappedIndex !== selectedFileIndex) {
        selectFile(mappedIndex);
      }
    }
  }

  function handleRotaryDragEnd() {
    isDragging = false;
    if (rotaryKnob) rotaryKnob.style.cursor = 'grab';
  }

  function bindRotaryEvents() {
    if (!rotaryKnob) return;
    rotaryKnob.addEventListener('mousedown', handleRotaryDragStart);
    rotaryKnob.addEventListener('touchstart', handleRotaryDragStart, { passive: false });
    window.addEventListener('mousemove', handleRotaryDragMove);
    window.addEventListener('touchmove', handleRotaryDragMove, { passive: false });
    window.addEventListener('mouseup', handleRotaryDragEnd);
    window.addEventListener('touchend', handleRotaryDragEnd);
  }

  function handleTransportClick(operation) {
    if (!powerToggle || !powerToggle.checked) return;
    switch (operation) {
      case 'rewind':
        showCassetteAnimation('REWINDING DIRECTORY', 2000);
        if (selectedFileIndex > 0) {
          selectFile(selectedFileIndex - 1);
        } else {
          const lastIndex = document.querySelectorAll('.file-entry').length - 1;
          selectFile(lastIndex);
        }
        break;
      case 'play':
        showCassetteAnimation('EXECUTING FILE', 1500);
        updateTickerMessage();
        break;
      case 'fastforward':
        showCassetteAnimation('FAST FORWARDING', 1600);
        const entries = document.querySelectorAll('.file-entry');
        if (selectedFileIndex < entries.length - 1) {
          selectFile(selectedFileIndex + 1);
        } else {
          selectFile(0);
        }
        break;
      case 'stop':
        if (cassetteTimer) {
          clearTimeout(cassetteTimer);
          cassetteTimer = null;
        }
        if (cassetteOverlay) cassetteOverlay.classList.remove('active');
        break;
      case 'record':
        showCassetteAnimation('RECORDING NEW FILE', 2200);
        break;
    }
  }

  function bindTransportButtons() {
    document.getElementById('btnRewind')?.addEventListener('click', () => handleTransportClick('rewind'));
    document.getElementById('btnPlay')?.addEventListener('click', () => handleTransportClick('play'));
    document.getElementById('btnFastForward')?.addEventListener('click', () => handleTransportClick('fastforward'));
    document.getElementById('btnStop')?.addEventListener('click', () => handleTransportClick('stop'));
    document.getElementById('btnRecord')?.addEventListener('click', () => handleTransportClick('record'));
  }

  function bindFileListClicks() {
    if (!fileList) return;
    fileList.addEventListener('click', (e) => {
      const entry = e.target.closest('.file-entry');
      if (!entry) return;
      const entries = Array.from(fileList.querySelectorAll('.file-entry'));
      const index = entries.indexOf(entry);
      if (index !== -1) {
        selectFile(index);
      }
    });
  }

  function applyThemeMode() {
    if (!modeToggle) return;
    if (modeToggle.checked) {
      body.classList.add('theme-green');
      body.classList.remove('theme-amber');
    } else {
      body.classList.add('theme-amber');
      body.classList.remove('theme-green');
    }
  }

  function applyBloomEffect() {
    if (!bloomToggle) return;
    if (bloomToggle.checked) {
      body.classList.remove('bloom-disabled');
    } else {
      body.classList.add('bloom-disabled');
    }
  }

  function handlePowerToggle() {
    if (!powerToggle) return;
    const isOn = powerToggle.checked;
    const interactiveElements = document.querySelectorAll('.transport-btn, .file-entry, .rotary-dial-module, .toggle-switch input:not(#powerToggle)');
    interactiveElements.forEach(el => {
      if (isOn) {
        el.removeAttribute('disabled');
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else {
        el.setAttribute('disabled', 'disabled');
        el.style.opacity = '0.4';
        el.style.pointerEvents = 'none';
      }
    });
    if (!isOn && cassetteOverlay) {
      cassetteOverlay.classList.remove('active');
    }
  }

  function initToggles() {
    if (modeToggle) {
      modeToggle.addEventListener('change', applyThemeMode);
      applyThemeMode();
    }
    if (bloomToggle) {
      bloomToggle.addEventListener('change', applyBloomEffect);
      applyBloomEffect();
    }
    if (powerToggle) {
      powerToggle.addEventListener('change', handlePowerToggle);
      handlePowerToggle();
    }
  }

  function startIntervals() {
    updateClock();
    updateTickerMessage();
    updateVUMeters();
    setInterval(updateClock, 1000);
    setInterval(updateTickerMessage, 12000);
    vuInterval = setInterval(updateVUMeters, 700);
  }

  function initHeaderTapeAnimation() {
    if (headerTape) {
      headerTape.style.animationPlayState = 'running';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initToggles();
    bindRotaryEvents();
    bindTransportButtons();
    bindFileListClicks();
    startIntervals();
    initHeaderTapeAnimation();
    selectFile(0);
  });

})();
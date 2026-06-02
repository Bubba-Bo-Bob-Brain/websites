// scripts.js — OS/70 analog terminal logic

(function() {
  'use strict';

  // ----- DOM refs -----
  const glass = document.querySelector('.crt-glass');
  const fileListEl = document.getElementById('fileList');
  const tickerPaper = document.getElementById('tickerPaper');
  const clearLogBtn = document.getElementById('clearLog');
  const tapeCounter = document.getElementById('tapeCounter');
  const dialKnob = document.getElementById('dialKnob');
  const dialValue = document.getElementById('dialValue');
  const leftTapeWind = document.querySelector('.left-reel .tape-wind');
  const rightTapeWind = document.querySelector('.right-reel .tape-wind');

  // toggles
  const powerToggle = document.getElementById('powerGlow');
  const bloomToggle = document.getElementById('bloomToggle');
  const scanToggle = document.getElementById('scanToggle');
  const amberToggle = document.getElementById('amberToggle');
  const dirToggle = document.getElementById('dirToggle');

  // bloom & scanline elements
  const bloomEl = document.querySelector('.phosphor-bloom');
  const scanEl = document.querySelector('.phosphor-scanlines');

  // ----- state -----
  let currentDepth = 0;               // 0..5
  let tapeCounterValue = 0;
  let tapeInterval = null;
  let reelAngle = { left: 0, right: 180 };
  let reelInterval = null;

  // ----- mock file system -----
  const fileSystem = {
    '/': [
      { name: 'SYS', size: '—', isDir: true },
      { name: 'USR', size: '—', isDir: true },
      { name: 'TAPE_A', size: '—', isDir: true },
      { name: 'TAPE_B', size: '—', isDir: true },
      { name: 'BOOT.CMD', size: '1.2K' },
      { name: 'KERNEL.70', size: '24.6K' },
      { name: 'FUTURE.PLN', size: '8.1K' },
    ],
    '/SYS': [
      { name: 'MONITOR.70', size: '12.4K' },
      { name: 'FILES.SYS', size: '4.0K' },
      { name: 'CLOCK.DRV', size: '0.8K' },
      { name: 'TAPE.DRV', size: '1.6K' },
    ],
    '/USR': [
      { name: 'OPERATOR', size: '—', isDir: true },
      { name: 'GUEST', size: '—', isDir: true },
      { name: 'LOGIN.LST', size: '0.3K' },
    ],
    '/USR/OPERATOR': [
      { name: 'NOTES.TXT', size: '2.1K' },
      { name: 'SCHEMATICS.A70', size: '15.2K' },
      { name: 'DIARY.70', size: '6.7K' },
    ],
    '/USR/GUEST': [
      { name: 'README.70', size: '0.5K' },
      { name: 'HELLO.C', size: '0.2K' },
    ],
    '/TAPE_A': [
      { name: 'VOLUME_MARK', size: '—', isDir: true },
      { name: 'BACKUP.70', size: '128K' },
      { name: 'ARCHIVE.A70', size: '256K' },
    ],
    '/TAPE_B': [
      { name: 'VOLUME_MARK', size: '—', isDir: true },
      { name: 'DATA_01.BIN', size: '64K' },
      { name: 'DATA_02.BIN', size: '64K' },
    ],
  };

  const pathByDepth = ['/', '/SYS', '/USR', '/USR/OPERATOR', '/TAPE_A', '/TAPE_B'];

  // ----- helper: render file list -----
  function renderFileList(depth) {
    const dir = pathByDepth[depth] || '/';
    const files = fileSystem[dir] || fileSystem['/'];
    fileListEl.innerHTML = '';

    // add parent dir indicator unless root
    if (depth > 0) {
      const parentEntry = document.createElement('div');
      parentEntry.className = 'file-entry';
      parentEntry.innerHTML = `<span class="file-name" style="color:#b08a50;">.. (up)</span><span class="file-size">—</span>`;
      fileListEl.appendChild(parentEntry);
    }

    files.forEach(f => {
      const entry = document.createElement('div');
      entry.className = 'file-entry';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'file-name';
      nameSpan.textContent = f.isDir ? '📁 ' + f.name : '📄 ' + f.name;
      const sizeSpan = document.createElement('span');
      sizeSpan.className = 'file-size';
      sizeSpan.textContent = f.size;
      entry.appendChild(nameSpan);
      entry.appendChild(sizeSpan);
      fileListEl.appendChild(entry);
    });

    // log directory change
    addLogEntry(`DIR: ${dir} (${files.length} entries)`);
  }

  // ----- ticker tape log -----
  function addLogEntry(text) {
    const line = document.createElement('div');
    line.className = 'ticker-line';
    line.textContent = '> ' + text;
    tickerPaper.appendChild(line);
    tickerPaper.scrollTop = tickerPaper.scrollHeight;

    // keep last 40 lines
    while (tickerPaper.children.length > 40) {
      tickerPaper.removeChild(tickerPaper.firstChild);
    }
  }

  // ----- tape counter & reel animation -----
  function updateTapeCounter() {
    tapeCounterValue = (tapeCounterValue + 1) % 10000;
    const str = String(tapeCounterValue).padStart(4, '0');
    tapeCounter.textContent = str;
  }

  function updateReels() {
    reelAngle.left = (reelAngle.left + 3) % 360;
    reelAngle.right = (reelAngle.right + 3) % 360;
    if (leftTapeWind) {
      leftTapeWind.style.setProperty('--wind', reelAngle.left + 'deg');
    }
    if (rightTapeWind) {
      rightTapeWind.style.setProperty('--wind', reelAngle.right + 'deg');
    }
  }

  function startTapeAnimation() {
    if (tapeInterval) clearInterval(tapeInterval);
    if (reelInterval) clearInterval(reelInterval);
    tapeInterval = setInterval(updateTapeCounter, 320);
    reelInterval = setInterval(updateReels, 80);
  }

  function stopTapeAnimation() {
    if (tapeInterval) {
      clearInterval(tapeInterval);
      tapeInterval = null;
    }
    if (reelInterval) {
      clearInterval(reelInterval);
      reelInterval = null;
    }
  }

  // ----- rotary dial -----
  let dialAngle = 0;
  let isDragging = false;
  let startY = 0;
  let startDepth = 0;

  function updateDial(value) {
    currentDepth = Math.min(5, Math.max(0, value));
    dialValue.textContent = currentDepth;
    const angle = (currentDepth / 5) * 270 - 135; // -135 to +135
    dialAngle = angle;
    const notch = dialKnob.querySelector('.dial-notch');
    if (notch) {
      notch.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
    renderFileList(currentDepth);
    // tape activity burst
    addLogEntry(`DIAL: depth ${currentDepth}`);
  }

  // mouse / pointer drag
  dialKnob.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startDepth = currentDepth;
    dialKnob.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  dialKnob.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const steps = Math.round(deltaY / 20);
    const newDepth = Math.min(5, Math.max(0, startDepth + steps));
    if (newDepth !== currentDepth) {
      updateDial(newDepth);
      startDepth = newDepth;
      startY = e.clientY;
    }
  });

  dialKnob.addEventListener('pointerup', () => {
    isDragging = false;
  });

  dialKnob.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  // keyboard support for dial
  dialKnob.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      updateDial(Math.min(5, currentDepth + 1));
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      updateDial(Math.max(0, currentDepth - 1));
    }
  });

  // ----- toggle controls -----
  function applyToggles() {
    // power glow (master visibility)
    const powerOn = powerToggle.checked;
    glass.style.opacity = powerOn ? '1' : '0.35';
    // bloom
    if (bloomEl) {
      bloomEl.style.opacity = (bloomToggle.checked && powerOn) ? '0.6' : '0';
    }
    // scanlines
    if (scanEl) {
      scanEl.style.opacity = (scanToggle.checked && powerOn) ? '0.35' : '0';
    }
    // amber / green theme
    if (amberToggle.checked) {
      glass.dataset.theme = 'amber';
    } else {
      glass.dataset.theme = 'green';
    }
  }

  powerToggle.addEventListener('change', applyToggles);
  bloomToggle.addEventListener('change', applyToggles);
  scanToggle.addEventListener('change', applyToggles);
  amberToggle.addEventListener('change', applyToggles);

  // dir toggle just logs
  dirToggle.addEventListener('change', function() {
    const mode = this.checked ? 'DETAIL' : 'SIMPLE';
    addLogEntry(`DIR MODE: ${mode}`);
    // re-render for visual feedback (just log)
    renderFileList(currentDepth);
  });

  // ----- clear log -----
  clearLogBtn.addEventListener('click', () => {
    tickerPaper.innerHTML = '';
    addLogEntry('LOG CLEARED');
  });

  // ----- tape simulation start/stop via power -----
  powerToggle.addEventListener('change', function() {
    if (this.checked) {
      startTapeAnimation();
      addLogEntry('POWER ON');
    } else {
      stopTapeAnimation();
      addLogEntry('POWER OFF');
    }
  });

  // ----- initial boot -----
  function bootSequence() {
    // set initial dial position
    updateDial(0);

    // start tape animation
    if (powerToggle.checked) {
      startTapeAnimation();
    }

    // apply toggles
    applyToggles();

    // log boot
    addLogEntry('* OS/70 BOOT SEQUENCE COMPLETE');
    addLogEntry('* TAPE DRIVES ONLINE');
    addLogEntry('* CRT PHOSPHOR STABILIZED');
    addLogEntry('* SYSTEM READY.');
  }

  // simulate reel wind effect on any file interaction (extra flair)
  fileListEl.addEventListener('mouseenter', () => {
    // brief speedup illusion
    if (tapeInterval) {
      clearInterval(tapeInterval);
      tapeInterval = setInterval(updateTapeCounter, 120);
    }
    if (reelInterval) {
      clearInterval(reelInterval);
      reelInterval = setInterval(updateReels, 40);
    }
  });

  fileListEl.addEventListener('mouseleave', () => {
    // restore normal speed
    if (powerToggle.checked) {
      if (tapeInterval) {
        clearInterval(tapeInterval);
        tapeInterval = setInterval(updateTapeCounter, 320);
      }
      if (reelInterval) {
        clearInterval(reelInterval);
        reelInterval = setInterval(updateReels, 80);
      }
    }
  });

  // ----- start -----
  bootSequence();

  // extra: click on file entry logs selection
  fileListEl.addEventListener('click', (e) => {
    const entry = e.target.closest('.file-entry');
    if (!entry) return;
    const nameEl = entry.querySelector('.file-name');
    if (nameEl) {
      const name = nameEl.textContent.replace(/[📁📄]\s*/, '');
      addLogEntry(`SELECT: ${name}`);
    }
  });

})();
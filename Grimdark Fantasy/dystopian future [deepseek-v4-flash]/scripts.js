/**
 * OBSIDIAN GRID // AEGIS DIRECTORATE
 * Terminal Surveillance System
 * v.9.4.1
 */

(function() {
  'use strict';

  // ================================================================
  // CONFIGURATION
  // ================================================================

  const CONFIG = {
    glitchInterval: 4000,       // ms between random glitch events
    staticBurstInterval: 8000,  // ms between static bursts
    dataStreamInterval: 3000,   // ms between new data stream lines
    threatUpdateInterval: 10000,// ms between threat level changes
    territoryUpdateInterval: 5000, // ms between territory bar updates
    clockUpdateInterval: 1000,  // ms between clock updates
    feedNoiseInterval: 200,     // ms between feed noise updates
    resistancePulseInterval: 2000, // ms between resistance node pulses
  };

  // ================================================================
  // DOM REFERENCES
  // ================================================================

  const dom = {
    clock: document.getElementById('headerClock'),
    staticOverlay: document.getElementById('staticOverlay'),
    glitchFlash: document.getElementById('glitchFlash'),
    statusDot: document.getElementById('statusDot'),
    threatLevel: document.getElementById('threatLevel'),
    territoryMap: document.getElementById('territoryMap'),
    broadcastStatic: document.getElementById('broadcastStatic'),
    broadcastContent: document.getElementById('broadcastContent'),
    dataStream: document.getElementById('dataStream'),
    feedGrid: document.getElementById('feedGrid'),
    resistanceMap: document.getElementById('resistanceMap'),
    broadcastTicker: document.getElementById('broadcastTicker'),
  };

  // ================================================================
  // STATE
  // ================================================================

  const state = {
    territoryData: [
      { label: 'AEGIS', percent: 58.3, fillClass: 'fill-aegis' },
      { label: 'IRON FRONT', percent: 24.7, fillClass: 'fill-rebel' },
      { label: 'NEUTRAL', percent: 17.0, fillClass: 'fill-neutral' },
    ],
    threatLevels: ['LOW', 'ELEVATED', 'HIGH', 'CRITICAL'],
    currentThreatIndex: 1,
    broadcastMessages: [
      { symbol: '☩', headline: 'ORDER PREVAILS', sub: 'The Directorate secures the future. Resistance is futile.', footer: '"Unity through surveillance. Peace through strength."' },
      { symbol: '⚔', headline: 'IRON FRONT CONTAINED', sub: 'Sector 12 insurgency neutralized. All civilians report to checkpoints.', footer: '"Compliance ensures survival."' },
      { symbol: '◈', headline: 'NEW PROTOCOL ACTIVE', sub: 'Biometric scanning mandatory in all sectors. Non-compliance is treason.', footer: '"Your identity is your duty."' },
      { symbol: '⏣', headline: 'CURFEW EXTENDED', sub: 'All movement restricted between 19:00 and 06:00. Violators will be detained.', footer: '"The streets belong to the Directorate."' },
      { symbol: '☠', headline: 'TRAITORS WILL FALL', sub: 'Resistance cells identified. Report suspicious activity immediately.', footer: '"Loyalty is the only path."' },
    ],
    currentBroadcastIndex: 0,
    dataStreamLines: [
      '[00:00:00] <span class="stream-corrupt">7F 3A 29 B1 88 4C</span> // HANDSHAKE INIT',
      '[00:00:01] <span class="stream-corrupt">DE AD BE EF 00 11</span> // AUTH REQUEST',
      '[00:00:02] <span class="stream-corrupt">FF FF FF FF FF FF</span> // <span class="redacted">████</span>',
      '[00:00:03] ERR // PACKET LOST',
      '[00:00:04] <span class="stream-corrupt">A1 B2 C3 D4 E5 F6</span> // DATA CORRUPT',
      '[00:00:05] REBOOT SEQUENCE // <span class="redacted">████████</span>',
    ],
    tickerMessages: [
      '// IRON FRONT INSURGENCY CONTAINED IN SECTOR 12 // NEW BIOMETRIC CHECKPOINTS ACTIVE // CURFEW EXTENDED INDEFINITELY // ALL CIVILIAN DATA TRANSMISSIONS MONITORED //',
      '// RESISTANCE CELL DISMANTLED IN SECTOR 4 // 47 APPREHENDED // MARTIAL LAW IN EFFECT // REPORT ANOMALOUS ACTIVITY TO NEAREST DIRECTORATE OFFICE //',
      '// DATA PURGE COMPLETE // 12,481 RECORDS REMOVED // ALL UNAUTHORIZED NETWORKS DISABLED // COMPLIANCE IS MANDATORY //',
    ],
    currentTickerIndex: 0,
    feedStates: ['FEED CORRUPTED', 'SIGNAL LOST', 'RESTRICTED', 'ENCRYPTED'],
    feedIcons: ['◉', '◎', '◌', '○'],
    isGlitching: false,
  };

  // ================================================================
  // UTILITY FUNCTIONS
  // ================================================================

  function padNumber(num, length = 2) {
    return String(num).padStart(length, '0');
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ================================================================
  // CLOCK
  // ================================================================

  function updateClock() {
    const now = new Date();
    const hours = padNumber(now.getHours());
    const minutes = padNumber(now.getMinutes());
    const seconds = padNumber(now.getSeconds());
    dom.clock.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // ================================================================
  // TERRITORY CONTROL
  // ================================================================

  function renderTerritoryBars() {
    dom.territoryMap.innerHTML = '';
    state.territoryData.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'territory-bar';

      const label = document.createElement('span');
      label.className = 'territory-bar-label';
      label.textContent = item.label.substring(0, 4);

      const track = document.createElement('div');
      track.className = 'territory-bar-track';

      const fill = document.createElement('div');
      fill.className = `territory-bar-fill ${item.fillClass}`;
      fill.style.width = '0%';
      fill.dataset.targetPercent = item.percent;

      const value = document.createElement('span');
      value.className = 'territory-bar-value';
      value.textContent = `${item.percent.toFixed(1)}%`;

      track.appendChild(fill);
      bar.appendChild(label);
      bar.appendChild(track);
      bar.appendChild(value);
      dom.territoryMap.appendChild(bar);
    });

    // Animate bars filling up
    setTimeout(() => {
      document.querySelectorAll('.territory-bar-fill').forEach(fill => {
        fill.style.width = fill.dataset.targetPercent + '%';
      });
    }, 200);
  }

  function updateTerritoryData() {
    // Simulate slight fluctuations in territory control
    state.territoryData.forEach((item, index) => {
      const delta = (Math.random() - 0.5) * 0.6;
      let newPercent = item.percent + delta;
      // Keep within reasonable bounds
      if (index === 0) newPercent = Math.max(50, Math.min(65, newPercent));
      else if (index === 1) newPercent = Math.max(18, Math.min(30, newPercent));
      else newPercent = Math.max(12, Math.min(22, newPercent));
      item.percent = parseFloat(newPercent.toFixed(1));
    });

    // Normalize to 100%
    const total = state.territoryData.reduce((sum, item) => sum + item.percent, 0);
    state.territoryData.forEach(item => {
      item.percent = parseFloat(((item.percent / total) * 100).toFixed(1));
    });

    renderTerritoryBars();
  }

  // ================================================================
  // GLITCH EFFECTS
  // ================================================================

  function triggerGlitch() {
    if (state.isGlitching) return;
    state.isGlitching = true;

    // Flash the glitch overlay
    dom.glitchFlash.style.opacity = '0.15';
    setTimeout(() => {
      dom.glitchFlash.style.opacity = '0';
    }, 80);

    // Random screen shift effect
    const terminal = document.querySelector('.terminal');
    const originalTransform = terminal.style.transform;
    const shiftX = randomBetween(-3, 3);
    const shiftY = randomBetween(-2, 2);
    terminal.style.transform = `translate(${shiftX}px, ${shiftY}px)`;

    setTimeout(() => {
      terminal.style.transform = originalTransform;
      state.isGlitching = false;
    }, 120);

    // Randomly corrupt a feed cell
    const cells = document.querySelectorAll('.feed-cell');
    if (cells.length > 0) {
      const randomCell = cells[randomBetween(0, cells.length - 1)];
      const idSpan = randomCell.querySelector('.feed-id');
      if (idSpan) {
        idSpan.textContent = randomItem(state.feedStates);
        idSpan.style.color = '#c0392b';
        setTimeout(() => {
          idSpan.style.color = '';
        }, 500);
      }
    }
  }

  // ================================================================
  // STATIC BURST
  // ================================================================

  function triggerStaticBurst() {
    dom.staticOverlay.style.opacity = '0.08';
    setTimeout(() => {
      dom.staticOverlay.style.opacity = '0';
    }, 150);
  }

  // ================================================================
  // BROADCAST SYSTEM
  // ================================================================

  function updateBroadcast() {
    state.currentBroadcastIndex = (state.currentBroadcastIndex + 1) % state.broadcastMessages.length;
    const msg = state.broadcastMessages[state.currentBroadcastIndex];

    // Flash static before transition
    dom.broadcastStatic.style.opacity = '0.3';
    setTimeout(() => {
      dom.broadcastStatic.style.opacity = '0.15';
    }, 200);

    // Update content after a brief delay (simulating signal recovery)
    setTimeout(() => {
      const symbol = dom.broadcastContent.querySelector('.broadcast-symbol');
      const headline = dom.broadcastContent.querySelector('.broadcast-headline');
      const sub = dom.broadcastContent.querySelector('.broadcast-sub');
      const footer = dom.broadcastContent.querySelector('.broadcast-footer-text');

      if (symbol) symbol.textContent = msg.symbol;
      if (headline) headline.textContent = msg.headline;
      if (sub) sub.textContent = msg.sub;
      if (footer) footer.textContent = msg.footer;
    }, 300);
  }

  // ================================================================
  // DATA STREAM
  // ================================================================

  function addDataStreamLine() {
    const timestamp = new Date();
    const h = padNumber(timestamp.getHours());
    const m = padNumber(timestamp.getMinutes());
    const s = padNumber(timestamp.getSeconds());

    const hexValues = Array.from({ length: 6 }, () =>
      randomItem(['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'])
    ).join(' ');

    const messages = [
      `// DATA PACKET #${randomBetween(1000, 9999)}`,
      `// SECTOR ${randomBetween(1, 12)} SCAN`,
      `// <span class="redacted">████</span> PROTOCOL`,
      `// AUTH FAILED // RETRY`,
      `// ENCRYPTED TRANSMISSION`,
      `// PACKET LOST // RESEND`,
      `// NODE ${randomBetween(1, 255)} DISCONNECTED`,
    ];

    const line = document.createElement('div');
    line.className = 'stream-line';
    line.innerHTML = `[${h}:${m}:${s}] <span class="stream-corrupt">${hexValues}</span> ${randomItem(messages)}`;

    dom.dataStream.appendChild(line);

    // Keep only last 20 lines to prevent memory issues
    while (dom.dataStream.children.length > 20) {
      dom.dataStream.removeChild(dom.dataStream.firstChild);
    }

    // Auto-scroll to bottom
    dom.dataStream.scrollTop = dom.dataStream.scrollHeight;
  }

  // ================================================================
  // TICKER
  // ================================================================

  function updateTicker() {
    state.currentTickerIndex = (state.currentTickerIndex + 1) % state.tickerMessages.length;
    const ticker = dom.broadcastTicker.querySelector('.ticker-text');
    if (ticker) {
      ticker.textContent = state.tickerMessages[state.currentTickerIndex];
      // Reset animation
      ticker.style.animation = 'none';
      ticker.offsetHeight; // Trigger reflow
      ticker.style.animation = 'ticker-scroll 20s linear infinite';
    }
  }

  // ================================================================
  // FEED NOISE
  // ================================================================

  function updateFeedNoise() {
    const noiseElements = document.querySelectorAll('.feed-noise');
    noiseElements.forEach(el => {
      const randomOffset = randomBetween(0, 100);
      el.style.backgroundPosition = `0 ${randomOffset}px`;
    });
  }

  // ================================================================
  // RESISTANCE NETWORK
  // ================================================================

  function setupResistanceMap() {
    const map = dom.resistanceMap;
    const mapRect = map.getBoundingClientRect();

    // Position nodes relative to the map container
    const nodes = map.querySelectorAll('.map-node');
    const positions = [
      { top: '50%', left: '50%' },
      { top: '15%', left: '20%' },
      { top: '15%', right: '20%' },
      { bottom: '20%', left: '25%' },
      { bottom: '15%', left: '50%' },
      { bottom: '20%', right: '25%' },
    ];

    nodes.forEach((node, index) => {
      if (positions[index]) {
        const pos = positions[index];
        Object.keys(pos).forEach(key => {
          node.style[key] = pos[key];
        });
      }
    });

    // Draw connection lines
    const connections = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 4 },
    ];

    connections.forEach(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      if (!fromNode || !toNode) return;

      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - mapRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - mapRect.top;
      const x2 = toRect.left + toRect.width / 2 - mapRect.left;
      const y2 = toRect.top + toRect.height / 2 - mapRect.top;

      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      const line = document.createElement('div');
      line.className = 'map-line';
      line.style.width = `${length}px`;
      line.style.left = `${x1}px`;
      line.style.top = `${y1}px`;
      line.style.transform = `rotate(${angle}deg)`;

      map.appendChild(line);
    });
  }

  // ================================================================
  // THREAT LEVEL
  // ================================================================

  function updateThreatLevel() {
    state.currentThreatIndex = (state.currentThreatIndex + 1) % state.threatLevels.length;
    const level = state.threatLevels[state.currentThreatIndex];
    dom.threatLevel.textContent = `THREAT LEVEL: ${level}`;

    // Change color based on threat level
    const colors = {
      'LOW': '#2ecc71',
      'ELEVATED': '#e8b84b',
      'HIGH': '#e67e22',
      'CRITICAL': '#c0392b',
    };

    dom.threatLevel.style.color = colors[level] || '#c0392b';

    // Flash status dot on critical
    if (level === 'CRITICAL') {
      dom.statusDot.style.background = '#c0392b';
      dom.statusDot.style.boxShadow = '0 0 8px rgba(192,57,43,0.5)';
    } else {
      dom.statusDot.style.background = '#2ecc71';
      dom.statusDot.style.boxShadow = '0 0 6px rgba(46,204,113,0.3)';
    }
  }

  // ================================================================
  // FEED CELL INTERACTIVITY
  // ================================================================

  function setupFeedCells() {
    const cells = document.querySelectorAll('.feed-cell');
    cells.forEach((cell, index) => {
      cell.addEventListener('click', function() {
        const idSpan = this.querySelector('.feed-id');
        if (idSpan) {
          // Simulate trying to recover the feed
          idSpan.textContent = 'RECOVERING...';
          idSpan.style.color = '#e8b84b';
          setTimeout(() => {
            if (Math.random() > 0.5) {
              idSpan.textContent = 'FEED RESTORED';
              idSpan.style.color = '#2ecc71';
              this.style.borderColor = '#2ecc71';
            } else {
              idSpan.textContent = randomItem(state.feedStates);
              idSpan.style.color = '#c0392b';
              this.style.borderColor = '';
            }
          }, 1500);
        }
      });
    });
  }

  // ================================================================
  // RANDOM STATUS MESSAGES
  // ================================================================

  function updateStatusMessages() {
    const statusMessages = [
      'SCANNING SECTOR 7G',
      'DATA SYNC IN PROGRESS',
      'NODE 47 RESPONDING',
      'ENCRYPTION VERIFIED',
      'PATROL ROUTE ACTIVE',
      'BIOMETRIC CHECKPOINT ONLINE',
      'DRONE SWARM DEPLOYED',
      'SIGNAL INTERFERENCE DETECTED',
      'BACKUP PROTOCOL ENGAGED',
      'SURVEILLANCE GRID OPTIMAL',
    ];

    const statusLabel = document.querySelector('.status-label');
    if (statusLabel) {
      setInterval(() => {
        statusLabel.textContent = randomItem(statusMessages);
      }, 5000);
    }
  }

  // ================================================================
  // KEYBOARD INTERACTIONS (Easter Eggs)
  // ================================================================

  function setupKeyboardEasterEggs() {
    let keyBuffer = '';
    const secretCode = 'rebel';

    document.addEventListener('keydown', (e) => {
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);

      // Secret rebel code
      if (keyBuffer.includes(secretCode)) {
        // Flash resistance map
        const resistancePanel = document.querySelector('.resistance-panel');
        if (resistancePanel) {
          resistancePanel.style.borderColor = '#00bcd4';
          resistancePanel.style.boxShadow = '0 0 20px rgba(0,188,212,0.3)';
          setTimeout(() => {
            resistancePanel.style.borderColor = '';
            resistancePanel.style.boxShadow = '';
          }, 2000);

          // Change warning text
          const warning = resistancePanel.querySelector('.res-warning');
          if (warning) {
            warning.textContent = '⚠ REBEL SIGNAL DETECTED';
            warning.style.color = '#00bcd4';
          }
        }
        keyBuffer = '';
      }
    });
  }

  // ================================================================
  // RESIZE HANDLER
  // ================================================================

  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Redraw resistance map lines
      const oldLines = document.querySelectorAll('.map-line');
      oldLines.forEach(line => line.remove());
      setupResistanceMap();
    }, 300);
  }

  // ================================================================
  // INITIALIZATION
  // ================================================================

  function init() {
    // Initial render
    updateClock();
    renderTerritoryBars();
    setupResistanceMap();
    setupFeedCells();
    setupKeyboardEasterEggs();
    updateStatusMessages();

    // Set up intervals
    setInterval(updateClock, CONFIG.clockUpdateInterval);
    setInterval(triggerGlitch, CONFIG.glitchInterval);
    setInterval(triggerStaticBurst, CONFIG.staticBurstInterval);
    setInterval(updateBroadcast, 8000);
    setInterval(addDataStreamLine, CONFIG.dataStreamInterval);
    setInterval(updateTicker, 15000);
    setInterval(updateThreatLevel, CONFIG.threatUpdateInterval);
    setInterval(updateTerritoryData, CONFIG.territoryUpdateInterval);
    setInterval(updateFeedNoise, CONFIG.feedNoiseInterval);

    // Initial static burst
    setTimeout(triggerStaticBurst, 500);

    // Add initial data stream lines
    for (let i = 0; i < 6; i++) {
      setTimeout(() => addDataStreamLine(), i * 500);
    }

    // Window resize handler
    window.addEventListener('resize', handleResize);

    // Log
    console.log('%c OBSIDIAN GRID v.9.4.1 // AEGIS DIRECTORATE ',
      'background: #0a0a0a; color: #c0392b; font-size: 12px; padding: 4px; border: 1px solid #c0392b;');
    console.log('%c ⚠ UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE ',
      'background: #0a0a0a; color: #e8b84b; font-size: 10px; padding: 2px;');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
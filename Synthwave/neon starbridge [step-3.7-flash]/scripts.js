// NEXUS-7 Bridge Console - Synthwave Interactive Logic
// Wait for DOM to fully load before initializing
document.addEventListener('DOMContentLoaded', () => {
  // =============================================
  // DOM ELEMENT SELECTION
  // =============================================
  const viewportCanvas = document.getElementById('viewport-canvas');
  const viewportCtx = viewportCanvas.getContext('2d');
  const navCanvas = document.getElementById('nav-canvas');
  const navCtx = navCanvas.getContext('2d');
  const commsCanvas = document.getElementById('comms-canvas');
  const commsCtx = commsCanvas.getContext('2d');

  // System Displays
  const shieldCircle = document.getElementById('shield-circle');
  const shieldPercent = document.getElementById('shield-percent');
  const shieldPort = document.getElementById('shield-port');
  const shieldStarboard = document.getElementById('shield-starboard');
  const shieldFore = document.getElementById('shield-fore');
  const shieldAft = document.getElementById('shield-aft');
  const phaserCharge = document.getElementById('phaser-charge');
  const torpedoCount = document.getElementById('torpedo-count');
  const freqDisplay = document.getElementById('freq-display');
  const coordinatesDisplay = document.getElementById('coordinates');
  const velocityDisplay = document.getElementById('velocity');
  const headingDisplay = document.getElementById('heading');
  const etaDisplay = document.getElementById('eta');
  const hullIntegrity = document.getElementById('hull-integrity');
  const stardateDisplay = document.getElementById('stardate');
  const missionTimeDisplay = document.getElementById('mission-time');
  const alertOverlay = document.getElementById('alert-overlay');

  // Power Sliders
  const enginesPower = document.getElementById('engines-power');
  const weaponsPower = document.getElementById('weapons-power');
  const shieldsPower = document.getElementById('shields-power');
  const powerInputs = document.querySelectorAll('.power-input');

  // Buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  const sysButtons = document.querySelectorAll('.sys-btn');
  const controlButtons = document.querySelectorAll('.control-btn');

  // =============================================
  // SYSTEM STATE
  // =============================================
  const systemState = {
    warpActive: false,
    impulseActive: false,
    alertLevel: 'green', // green, yellow, red
    shields: {
      total: 87,
      port: 92,
      starboard: 85,
      fore: 78,
      aft: 95,
      boosted: false,
      boostEnd: 0
    },
    weapons: {
      phaserCharge: 100,
      torpedoCount: 24,
      targetLocked: false,
      targetId: 'NO TARGET',
      targetRange: '---'
    },
    comms: {
      frequency: 147.3,
      scanning: false
    },
    navigation: {
      coordinates: { x: 847.2, y: -129.4, z: 4921.8 },
      velocity: 'WARP 4.2',
      heading: 127.8,
      eta: '4y 127d 14h'
    },
    power: {
      engines: 75,
      weapons: 60,
      shields: 90
    },
    mission: {
      startTime: Date.now(),
      stardate: 2847.156
    }
  };

  // =============================================
  // AUDIO SETUP (Tone.js Synthwave Sounds)
  // =============================================
  let synth, noiseSynth;
  try {
    synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
    }).toDestination();
    noiseSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0 }
    }).toDestination();
    Tone.start();
  } catch (e) {
    console.log('Audio context not available');
  }

  const playBeep = (freq = 440, duration = 0.1) => {
    if (synth) synth.triggerAttackRelease(freq, duration);
  };

  const playAlert = () => {
    if (synth) {
      synth.triggerAttackRelease('C5', 0.2);
      setTimeout(() => synth.triggerAttackRelease('G5', 0.2), 200);
      setTimeout(() => synth.triggerAttackRelease('C5', 0.4), 400);
    }
  };

  const playStatic = (duration = 0.3) => {
    if (noiseSynth) noiseSynth.triggerAttackRelease(duration);
  };

  // =============================================
  // CANVAS SETUP & RESIZE
  // =============================================
  const resizeCanvases = () => {
    viewportCanvas.width = viewportCanvas.parentElement.clientWidth;
    viewportCanvas.height = viewportCanvas.parentElement.clientHeight;
    navCanvas.width = navCanvas.parentElement.clientWidth;
    navCanvas.height = navCanvas.parentElement.clientHeight;
    commsCanvas.width = commsCanvas.parentElement.clientWidth;
    commsCanvas.height = commsCanvas.parentElement.clientHeight;
  };
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // =============================================
  // VIEWPORT: STARFIELD, GRID, SUNSET
  // =============================================
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = (Math.random() - 0.5) * viewportCanvas.width * 2;
      this.y = (Math.random() - 0.5) * viewportCanvas.height * 2;
      this.z = Math.random() * 1000 + 500;
      this.size = Math.random() * 2 + 0.5;
      this.brightness = Math.random();
    }
    update(speed) {
      this.z -= speed;
      if (this.z <= 0) this.reset();
    }
    draw(ctx, centerX, centerY) {
      const x = (this.x / this.z) * 500 + centerX;
      const y = (this.y / this.z) * 500 + centerY;
      const size = (this.size * 1000) / this.z;
      const alpha = this.brightness * (1 - this.z / 1500);

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      if (systemState.warpActive) {
        // Warp streak effect
        const prevX = (this.x / (this.z + 20)) * 500 + centerX;
        const prevY = (this.y / (this.z + 20)) * 500 + centerY;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.lineWidth = size;
        ctx.stroke();
      } else {
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  class PerspectiveGrid {
    constructor() {
      this.offset = 0;
      this.gridSize = 40;
      this.horizonY = viewportCanvas.height * 0.45;
    }
    update(speed) {
      this.offset = (this.offset + speed) % this.gridSize;
    }
    draw(ctx, width, height) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      // Vertical perspective lines
      const centerX = width / 2;
      for (let i = -20; i <= 20; i++) {
        const x = centerX + i * 30;
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(centerX + i * 10, this.horizonY);
        ctx.stroke();
      }

      // Horizontal scrolling lines
      for (let y = this.horizonY; y < height; y += this.gridSize * ((y - this.horizonY) / (height - this.horizonY) * 0.8 + 0.2)) {
        const adjustedY = y + this.offset * ((y - this.horizonY) / (height - this.horizonY) * 0.8 + 0.2);
        if (adjustedY < height) {
          ctx.beginPath();
          ctx.moveTo(0, adjustedY);
          ctx.lineTo(width, adjustedY);
          ctx.stroke();
        }
      }
    }
  }

  class SunsetHorizon {
    draw(ctx, width, height) {
      const horizonY = height * 0.45;
      // Gradient sunset
      const gradient = ctx.createLinearGradient(0, horizonY - 100, 0, height);
      gradient.addColorStop(0, '#1a0a2e');
      gradient.addColorStop(0.3, '#4a1c6e');
      gradient.addColorStop(0.5, '#ff0080');
      gradient.addColorStop(0.7, '#ff5500');
      gradient.addColorStop(1, '#ffaa00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY - 100, width, height - horizonY + 100);

      // Horizontal scan lines on sunset
      ctx.strokeStyle = 'rgba(255, 0, 128, 0.1)';
      ctx.lineWidth = 1;
      for (let y = horizonY; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sun circle
      ctx.fillStyle = '#ff0080';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(width / 2, horizonY + 20, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sun horizontal lines (classic synthwave)
      ctx.fillStyle = '#1a0a2e';
      for (let i = 0; i < 5; i++) {
        const lineY = horizonY + 30 + i * 8;
        ctx.fillRect(width / 2 - 70, lineY, 140, 3);
      }
    }
  }

  // Initialize viewport elements
  const stars = Array.from({ length: 200 }, () => new Star());
  const grid = new PerspectiveGrid();
  const sunset = new SunsetHorizon();
  let mouseX = 0, mouseY = 0;

  // =============================================
  // NAVIGATION CHART
  // =============================================
  class NavStar {
    constructor() {
      this.x = Math.random() * navCanvas.width;
      this.y = Math.random() * navCanvas.height;
      this.size = Math.random() * 2 + 1;
      this.blinkSpeed = Math.random() * 0.05 + 0.01;
      this.blinkOffset = Math.random() * Math.PI * 2;
    }
    draw(ctx, time) {
      const alpha = 0.5 + Math.sin(time * this.blinkSpeed + this.blinkOffset) * 0.5;
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const navStars = Array.from({ length: 50 }, () => new NavStar());
  let courseProgress = 0;

  const drawNavChart = (time) => {
    navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
    // Background
    navCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    navCtx.fillRect(0, 0, navCanvas.width, navCanvas.height);

    // Draw stars
    navStars.forEach(star => star.draw(navCtx, time));

    // Draw course line to Proxima Centauri
    const startX = 30;
    const startY = navCanvas.height / 2;
    const endX = navCanvas.width - 30;
    const endY = navCanvas.height / 2 + Math.sin(time * 0.001) * 20;

    navCtx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
    navCtx.lineWidth = 2;
    navCtx.setLineDash([5, 5]);
    navCtx.beginPath();
    navCtx.moveTo(startX, startY);
    navCtx.lineTo(endX, endY);
    navCtx.stroke();
    navCtx.setLineDash([]);

    // Ship marker
    const shipX = startX + (endX - startX) * (courseProgress % 1);
    const shipY = startY + (endY - startY) * (courseProgress % 1);
    navCtx.fillStyle = '#00ffff';
    navCtx.shadowColor = '#00ffff';
    navCtx.shadowBlur = 10;
    navCtx.beginPath();
    navCtx.moveTo(shipX, shipY - 5);
    navCtx.lineTo(shipX + 5, shipY + 3);
    navCtx.lineTo(shipX - 5, shipY + 3);
    navCtx.closePath();
    navCtx.fill();
    navCtx.shadowBlur = 0;

    // Destination marker
    navCtx.fillStyle = '#ff00ff';
    navCtx.shadowColor = '#ff00ff';
    navCtx.shadowBlur = 10;
    navCtx.beginPath();
    navCtx.arc(endX, endY, 4, 0, Math.PI * 2);
    navCtx.fill();
    navCtx.shadowBlur = 0;
  };

  // =============================================
  // COMMS FREQUENCY WAVEFORM
  // =============================================
  let waveOffset = 0;
  const drawCommsWaveform = () => {
    commsCtx.clearRect(0, 0, commsCanvas.width, commsCanvas.height);
    commsCtx.strokeStyle = systemState.comms.scanning ? '#ff00ff' : '#00ffff';
    commsCtx.lineWidth = 2;
    commsCtx.shadowColor = systemState.comms.scanning ? '#ff00ff' : '#00ffff';
    commsCtx.shadowBlur = 5;
    commsCtx.beginPath();

    const amplitude = systemState.comms.scanning ? 30 : 15;
    const frequency = systemState.comms.scanning ? 0.1 : 0.05;

    for (let x = 0; x < commsCanvas.width; x++) {
      const y = commsCanvas.height / 2 + Math.sin(x * frequency + waveOffset) * amplitude * Math.random();
      if (x === 0) commsCtx.moveTo(x, y);
      else commsCtx.lineTo(x, y);
    }
    commsCtx.stroke();
    commsCtx.shadowBlur = 0;
    waveOffset += 0.1;
  };

  // =============================================
  // SYSTEM FUNCTIONS
  // =============================================
  const updateShields = () => {
    // Handle boost decay
    if (systemState.shields.boosted && Date.now() > systemState.shields.boostEnd) {
      systemState.shields.boosted = false;
    }

    // Regen shields based on power allocation
    const regenRate = systemState.power.shields * 0.01;
    if (!systemState.shields.boosted) {
      systemState.shields.total = Math.min(100, systemState.shields.total + regenRate * 0.1);
      systemState.shields.port = Math.min(100, systemState.shields.port + regenRate * 0.05);
      systemState.shields.starboard = Math.min(100, systemState.shields.starboard + regenRate * 0.05);
      systemState.shields.fore = Math.min(100, systemState.shields.fore + regenRate * 0.05);
      systemState.shields.aft = Math.min(100, systemState.shields.aft + regenRate * 0.05);
    }

    // Update UI
    const displayTotal = Math.round(systemState.shields.total);
    shieldPercent.textContent = `${displayTotal}%`;
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (displayTotal / 100) * circumference;
    shieldCircle.style.strokeDashoffset = offset;

    // Update sector bars
    shieldPort.style.width = `${systemState.shields.port}%`;
    shieldStarboard.style.width = `${systemState.shields.starboard}%`;
    shieldFore.style.width = `${systemState.shields.fore}%`;
    shieldAft.style.width = `${systemState.shields.aft}%`;

    // Update hull integrity based on shield level
    const hull = 98.7 - (100 - displayTotal) * 0.1;
    hullIntegrity.textContent = `${hull.toFixed(1)}%`;
  };

  const updateWeapons = () => {
    // Charge phasers based on weapon power
    const chargeRate = systemState.power.weapons * 0.05;
    systemState.weapons.phaserCharge = Math.min(100, systemState.weapons.phaserCharge + chargeRate);
    phaserCharge.style.width = `${systemState.weapons.phaserCharge}%`;

    // Update torpedo count display
    torpedoCount.textContent = systemState.weapons.torpedoCount;
  };

  const updateNavigation = () => {
    // Update velocity based on power and warp state
    if (systemState.warpActive) {
      systemState.navigation.velocity = 'WARP 9.8';
      systemState.navigation.heading = (systemState.navigation.heading + 0.1) % 360;
    } else if (systemState.impulseActive) {
      systemState.navigation.velocity = 'IMPULSE 0.5';
    } else {
      systemState.navigation.velocity = 'ALL STOP';
    }
    velocityDisplay.textContent = systemState.navigation.velocity;
    headingDisplay.textContent = `${systemState.navigation.heading.toFixed(1)}°`;

    // Update coordinates based on velocity
    if (systemState.warpActive || systemState.impulseActive) {
      systemState.navigation.coordinates.x += 0.1 * (systemState.power.engines / 100);
      systemState.navigation.coordinates.z += 0.5 * (systemState.power.engines / 100);
      coordinatesDisplay.textContent = `X: ${systemState.navigation.coordinates.x.toFixed(1)} Y: ${systemState.navigation.coordinates.y.toFixed(1)} Z: ${systemState.navigation.coordinates.z.toFixed(1)}`;
    }

    // Update course progress
    courseProgress += 0.0001 * (systemState.warpActive ? 10 : 1);
  };

  const updateMissionTime = () => {
    const elapsed = Date.now() - systemState.mission.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    missionTimeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update stardate
    systemState.mission.stardate += 0.0001;
    stardateDisplay.textContent = systemState.mission.stardate.toFixed(3);
  };

  // =============================================
  // INTERACTION HANDLERS
  // =============================================
  // Navigation Buttons
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(660, 0.1);
      const action = btn.dataset.action;
      if (action === 'plot') {
        courseProgress = 0;
        addLogEntry('outgoing', 'NEXUS-7', 'COURSE PLOTTED TO PROXIMA CENTAURI B');
        playBeep(880, 0.2);
      } else if (action === 'scan') {
        addLogEntry('outgoing', 'NEXUS-7', 'INITIATING DEEP SPACE SCAN...');
        playStatic(0.5);
        setTimeout(() => {
          addLogEntry('incoming', 'DEEP SPACE NET', 'SCAN COMPLETE: 3 UNCHARTED PLANETS DETECTED');
        }, 2000);
      }
    });
  });

  // System Buttons
  sysButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(660, 0.1);
      const system = btn.dataset.system;
      const action = btn.dataset.action;

      if (system === 'shields') {
        if (action === 'boost') {
          systemState.shields.boosted = true;
          systemState.shields.boostEnd = Date.now() + 10000;
          systemState.shields.total = Math.min(100, systemState.shields.total + 20);
          systemState.shields.port = Math.min(100, systemState.shields.port + 20);
          systemState.shields.starboard = Math.min(100, systemState.shields.starboard + 20);
          systemState.shields.fore = Math.min(100, systemState.shields.fore + 20);
          systemState.shields.aft = Math.min(100, systemState.shields.aft + 20);
          addLogEntry('outgoing', 'NEXUS-7', 'SHIELD BOOST ACTIVATED');
          playBeep(1100, 0.3);
        } else if (action === 'redistribute') {
          const avg = systemState.shields.total / 4;
          systemState.shields.port = avg;
          systemState.shields.starboard = avg;
          systemState.shields.fore = avg;
          systemState.shields.aft = avg;
          addLogEntry('outgoing', 'NEXUS-7', 'SHIELD POWER REDISTRIBUTED');
          playBeep(880, 0.2);
        }
      } else if (system === 'weapons') {
        if (action === 'fire') {
          if (systemState.weapons.targetLocked && systemState.weapons.phaserCharge >= 100) {
            playBeep(220, 0.5); // Phaser sound
            systemState.weapons.phaserCharge = 0;
            addLogEntry('outgoing', 'NEXUS-7', 'PHASERS FIRED');
            // Flash viewport
            viewportCanvas.style.filter = 'brightness(2)';
            setTimeout(() => viewportCanvas.style.filter = 'none', 100);
          } else {
            addLogEntry('outgoing', 'NEXUS-7', 'FIRE ABORTED: NO TARGET OR CHARGE LOW');
            playBeep(220, 0.1); // Error sound
          }
        } else if (action === 'lock') {
          systemState.weapons.targetLocked = true;
          systemState.weapons.targetId = 'UNKNOWN CRAFT';
          systemState.weapons.targetRange = '1.2 AU';
          document.querySelector('.target-id').textContent = systemState.weapons.targetId;
          document.querySelector('.target-range').textContent = systemState.weapons.targetRange;
          addLogEntry('outgoing', 'NEXUS-7', 'TARGET LOCK ACQUIRED');
          playBeep(1320, 0.2);
        }
      } else if (system === 'comms') {
        if (action === 'hail') {
          addLogEntry('outgoing', 'NEXUS-7', 'OPENING COMM CHANNEL...');
          playStatic(0.8);
          setTimeout(() => {
            const sources = ['STARBASE ALPHA', 'DEEP SPACE NET', 'FREIGHTER EOS', 'SCIENCE VESSEL ODYSSEY'];
            const messages = [
              'NEXUS-7, THIS IS STARBASE ALPHA. YOU ARE CLEARED TO PROCEED.',
              'WARNING: SOLAR FLARE ACTIVITY DETECTED IN YOUR SECTOR.',
              'REQUESTING ASSISTANCE: ENGINE MALFUNCTION IN SECTOR 4.',
              'SCIENCE TEAM REQUESTS DATA ON THE ANOMALY YOU REPORTED.'
            ];
            const randomSource = sources[Math.floor(Math.random() * sources.length)];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            addLogEntry('incoming', randomSource, randomMsg);
            playBeep(990, 0.2);
          }, 2500);
        } else if (action === 'scan') {
          systemState.comms.scanning = true;
          systemState.comms.frequency = (Math.random() * 200 + 100).toFixed(1);
          freqDisplay.textContent = `${systemState.comms.frequency} MHz`;
          addLogEntry('outgoing', 'NEXUS-7', `SCANNING FREQUENCIES... LOCKED ON ${systemState.comms.frequency} MHz`);
          playStatic(1);
          setTimeout(() => systemState.comms.scanning = false, 2000);
        }
      }
    });
  });

  // Control Buttons
  controlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playBeep(660, 0.1);
      const action = btn.dataset.action;
      if (action === 'warp') {
        systemState.warpActive = true;
        systemState.impulseActive = false;
        addLogEntry('outgoing', 'NEXUS-7', 'WARP ENGAGED');
        playBeep(330, 0.5); // Warp sound
      } else if (action === 'impulse') {
        systemState.warpActive = false;
        systemState.impulseActive = true;
        addLogEntry('outgoing', 'NEXUS-7', 'IMPULSE ENGAGED');
        playBeep(440, 0.3);
      } else if (action === 'stop') {
        systemState.warpActive = false;
        systemState.impulseActive = false;
        addLogEntry('outgoing', 'NEXUS-7', 'ALL STOP');
        playBeep(220, 0.2);
      } else if (action === 'red-alert') {
        systemState.alertLevel = 'red';
        alertOverlay.classList.add('active');
        document.querySelectorAll('.status-value').forEach(el => {
          el.classList.add('danger');
          el.classList.remove('online', 'warning');
        });
        playAlert();
        addLogEntry('outgoing', 'NEXUS-7', 'RED ALERT: BATTLE STATIONS');
      } else if (action === 'yellow-alert') {
        systemState.alertLevel = 'yellow';
        alertOverlay.classList.remove('active');
        document.querySelectorAll('.status-value').forEach(el => {
          el.classList.add('warning');
          el.classList.remove('online', 'danger');
        });
        playBeep(550, 0.3);
        addLogEntry('outgoing', 'NEXUS-7', 'YELLOW ALERT: CONDITION READINESS');
      } else if (action === 'green-alert') {
        systemState.alertLevel = 'green';
        alertOverlay.classList.remove('active');
        document.querySelectorAll('.status-value').forEach(el => {
          el.classList.add('online');
          el.classList.remove('warning', 'danger');
        });
        playBeep(880, 0.2);
        addLogEntry('outgoing', 'NEXUS-7', 'GREEN ALERT: NORMAL OPERATIONS');
      }
    });
  });

  // Power Sliders
  powerInputs.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const system = e.target.dataset.system;
      const value = e.target.value;
      systemState.power[system] = parseInt(value);
      document.getElementById(`${system}-power`).textContent = `${value}%`;
      playBeep(880, 0.05);
    });
  });

  // Mouse Parallax for Viewport
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  const addLogEntry = (type, source, message) => {
    const commsLog = document.querySelector('.comms-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    entry.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-source">${source}</span>
      <span class="log-message">${message}</span>
    `;
    commsLog.insertBefore(entry, commsLog.firstChild);
    // Keep only last 10 entries
    if (commsLog.children.length > 10) {
      commsLog.removeChild(commsLog.lastChild);
    }
  };

  // Random event generator
  const triggerRandomEvent = () => {
    const events = [
      () => {
        systemState.shields.total = Math.max(70, systemState.shields.total - Math.random() * 10);
        addLogEntry('incoming', 'DEEP SPACE NET', 'MINOR SHIELD IMPACT DETECTED: MICROMETEOROID');
        playBeep(220, 0.3);
      },
      () => {
        const messages = ['GRAVITATIONAL ANOMALY DETECTED', 'SUBSPACE SIGNAL INTERFERENCE', 'UNIDENTIFIED VESSEL AT EDGE OF SENSOR RANGE'];
        addLogEntry('incoming', 'SENSORS', messages[Math.floor(Math.random() * messages.length)]);
        playStatic(0.2);
      },
      () => {
        systemState.navigation.coordinates.x += (Math.random() - 0.5) * 10;
        addLogEntry('incoming', 'NAVIGATION', 'COURSE CORRECTION APPLIED: DRIFT DETECTED');
        playBeep(660, 0.2);
      }
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
  };

  // Trigger random event every 30-60 seconds
  setInterval(triggerRandomEvent, Math.random() * 30000 + 30000);

  // =============================================
  // MAIN ANIMATION LOOP
  // =============================================
  const animate = (time) => {
    // Clear viewport
    viewportCtx.clearRect(0, 0, viewportCanvas.width, viewportCanvas.height);

    // Draw sunset horizon
    sunset.draw(viewportCtx, viewportCanvas.width, viewportCanvas.height);

    // Calculate speed based on power and warp state
    let speed = 2;
    if (systemState.warpActive) speed = 20;
    else if (systemState.impulseActive) speed = 5;
    speed *= (systemState.power.engines / 100);

    // Draw and update grid
    grid.update(speed);
    grid.draw(viewportCtx, viewportCanvas.width, viewportCanvas.height);

    // Draw and update stars with parallax
    const centerX = viewportCanvas.width / 2 + mouseX * 50;
    const centerY = viewportCanvas.height / 2 + mouseY * 50;
    stars.forEach(star => {
      star.update(speed);
      star.draw(viewportCtx, centerX, centerY);
    });

    // Draw navigation chart
    drawNavChart(time);

    // Draw comms waveform
    drawCommsWaveform();

    // Update systems
    updateShields();
    updateWeapons();
    updateNavigation();
    updateMissionTime();

    requestAnimationFrame(animate);
  };

  // =============================================
  // INITIALIZATION
  // =============================================
  // Initial log entries
  addLogEntry('incoming', 'SYSTEM', 'NEXUS-7 BRIDGE CONSOLE ONLINE');
  addLogEntry('incoming', 'CAPTAIN', 'ALL SYSTEMS NOMINAL. SET COURSE FOR PROXIMA CENTAURI B.');
  addLogEntry('outgoing', 'NEXUS-7', 'COURSE PLOTTED. ENGAGING WARP DRIVE.');

  // Start animation loop
  requestAnimationFrame(animate);
});
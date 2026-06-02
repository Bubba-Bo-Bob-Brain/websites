/* ============================================= */
/* NEBULA COMMANDER // BRIDGE CONSOLE SCRIPTS   */
/* Interactive Bridge Systems & Animations      */
/* ============================================= */

// === GLOBAL STATE ===
const state = {
  shipTime: new Date(),
  stardate: 2847.156,
  shieldIntegrity: { fore: 96, aft: 91, port: 94, starboard: 95, total: 94 },
  weapons: { targetLocked: false, lockProgress: 72, fireMode: 'SINGLE', isCharging: true },
  communications: { frequency: 142.847, isTransmitting: true, channel: 'SHIP', signalStrength: 4 },
  navigation: { velocity: 0.72, heading: 247.8, sector: 'ALPHA-7', eta: '47 DAYS 13 HRS' },
  systems: { lifeSupport: 'NOMINAL', powerCore: 98.7, fuelReserves: 87.3, hullIntegrity: 99.1 }
};

// === UTILITY FUNCTIONS ===
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function randomRange(min, max) { return Math.random() * (max - min) + min; }

// === TIME & DATE SYSTEMS ===
function updateShipTime() {
  state.shipTime.setSeconds(state.shipTime.getSeconds() + 1);
  const hours = String(state.shipTime.getHours()).padStart(2, '0');
  const minutes = String(state.shipTime.getMinutes()).padStart(2, '0');
  const seconds = String(state.shipTime.getSeconds()).padStart(2, '0');
  document.getElementById('ship-time').textContent = hours + ':' + minutes + ':' + seconds;
}

function updateStardate() {
  state.stardate += 0.001;
  document.getElementById('stardate').textContent = state.stardate.toFixed(3);
}

// === STAR CHART CANVAS ===
class StarChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.stars = this.generateStars(50);
    this.waypoints = this.generateWaypoints(5);
    this.currentPos = { x: 0.3, y: 0.4 };
    this.destination = { x: 0.85, y: 0.15 };
    this.animationFrame = 0;
    window.addEventListener('resize', function() { this.resize(); }.bind(this));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: randomRange(1, 3),
        brightness: randomRange(0.3, 1),
        twinkleSpeed: randomRange(0.01, 0.03),
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  generateWaypoints(count) {
    const waypoints = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / (count + 1);
      waypoints.push({
        x: lerp(this.currentPos.x, this.destination.x, t) + randomRange(-0.1, 0.1),
        y: lerp(this.currentPos.y, this.destination.y, t) + randomRange(-0.1, 0.1),
        label: 'WP-' + String(i + 1).padStart(2, '0')
      });
    }
    return waypoints;
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSpacing = 50;
    for (let x = 0; x < this.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawStar(star) {
    const ctx = this.ctx;
    const twinkle = Math.sin(this.animationFrame * star.twinkleSpeed + star.twinklePhase);
    const alpha = star.brightness * (0.7 + twinkle * 0.3);
    const x = star.x * this.width;
    const y = star.y * this.height;
    ctx.beginPath();
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawWaypoints() {
    const ctx = this.ctx;
    const self = this;
    this.waypoints.forEach(function(wp, i) {
      const x = wp.x * self.width;
      const y = wp.y * self.height;
      ctx.beginPath();
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2;
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y + 8);
      ctx.stroke();
      const pulse = Math.sin(self.animationFrame * 0.05 + i) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 12 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 230, 0, ' + (0.3 + pulse * 0.3) + ')';
      ctx.stroke();
      ctx.fillStyle = '#ffe600';
      ctx.font = '8px "Share Tech Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(wp.label, x, y + 22);
    });
  }

  drawPath() {
    const ctx = this.ctx;
    const self = this;
    ctx.beginPath();
    ctx.moveTo(this.currentPos.x * this.width, this.currentPos.y * this.height);
    this.waypoints.forEach(function(wp) {
      ctx.lineTo(wp.x * self.width, wp.y * self.height);
    });
    ctx.lineTo(this.destination.x * this.width, this.destination.y * this.height);
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCurrentPosition() {
    const ctx = this.ctx;
    const x = this.currentPos.x * this.width;
    const y = this.currentPos.y * this.height;
    ctx.beginPath();
    ctx.fillStyle = '#00f5ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f5ff';
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x - 6, y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00f5ff';
    ctx.font = '8px "Share Tech Mono"';
    ctx.textAlign = 'center';
    ctx.fillText('NEBULA MARAUDER', x, y - 15);
  }

  drawDestination() {
    const ctx = this.ctx;
    const x = this.destination.x * this.width;
    const y = this.destination.y * this.height;
    ctx.beginPath();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 2;
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 8, y);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x - 8, y);
    ctx.closePath();
    ctx.stroke();
    const pulse = Math.sin(this.animationFrame * 0.03) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 15 + pulse * 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.2 + pulse * 0.3) + ')';
    ctx.stroke();
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 9px "Orbitron"';
    ctx.textAlign = 'center';
    ctx.fillText('KEPLER-442b', x, y - 20);
  }

  animate() {
    this.animationFrame++;
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, this.width, this.height);
    this.drawGrid();
    this.drawPath();
    this.drawWaypoints();
    this.drawDestination();
    this.drawCurrentPosition();
    const self = this;
    this.stars.forEach(function(star) { self.drawStar(star); });
    var _this = this;
    requestAnimationFrame(function() { _this.animate(); });
  }

  start() { this.animate(); }
}

// === TARGET ACQUISITION CANVAS ===
class TargetAcquisition {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.animationFrame = 0;
    this.lockedTarget = { x: 0.5, y: 0.5, angle: 0, driftX: 0, driftY: 0 };
    this.scanPulse = 0;
    window.addEventListener('resize', function() { this.resize(); }.bind(this));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  drawScanLines() {
    const ctx = this.ctx;
    this.scanPulse += 0.02;
    const numLines = 20;
    for (let i = 0; i < numLines; i++) {
      const offset = (this.animationFrame * 2 + i * 30) % this.height;
      const alpha = 0.1 * (1 - offset / this.height);
      ctx.fillStyle = 'rgba(0, 245, 255, ' + alpha + ')';
      ctx.fillRect(0, offset, this.width, 2);
    }
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
    ctx.lineWidth = 1;
    const maxRadius = Math.min(this.width, this.height) / 2 - 20;
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, (maxRadius / 4) * r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.lineTo(this.centerX + Math.cos(angle) * maxRadius, this.centerY + Math.sin(angle) * maxRadius);
      ctx.stroke();
    }
  }

  drawHostileIndicator() {
    const ctx = this.ctx;
    this.lockedTarget.angle += 0.01;
    this.lockedTarget.driftX = Math.sin(this.lockedTarget.angle) * 20;
    this.lockedTarget.driftY = Math.cos(this.lockedTarget.angle * 0.7) * 15;
    const targetX = this.centerX + this.lockedTarget.driftX;
    const targetY = this.centerY + this.lockedTarget.driftY;
    ctx.save();
    ctx.translate(targetX, targetY);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 45, 149, 0.3)';
    ctx.strokeStyle = '#ff2d95';
    ctx.lineWidth = 2;
    ctx.moveTo(0, -15);
    ctx.lineTo(12, 10);
    ctx.lineTo(0, 5);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const enginePulse = Math.sin(this.animationFrame * 0.2) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(-5, 10, 3 + enginePulse * 2, 0, Math.PI * 2);
    ctx.arc(5, 10, 3 + enginePulse * 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 107, 53, ' + (0.5 + enginePulse * 0.5) + ')';
    ctx.fill();
    ctx.restore();
  }

  drawRangeIndicator() {
    const ctx = this.ctx;
    const distance = Math.sqrt(Math.pow(this.lockedTarget.driftX, 2) + Math.pow(this.lockedTarget.driftY, 2));
    const rangePercent = clamp(distance / 30, 0, 1);
    let color = '#39ff14';
    if (rangePercent > 0.7) color = '#ff073a';
    else if (rangePercent > 0.4) color = '#ffe600';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 60 + rangePercent * 20, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  animate() {
    this.animationFrame++;
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, this.width, this.height);
    this.drawScanLines();
    this.drawGrid();
    this.drawRangeIndicator();
    this.drawHostileIndicator();
    var _this = this;
    requestAnimationFrame(function() { _this.animate(); });
  }

  start() { this.animate(); }
}

// === FREQUENCY VISUALIZER ===
class FrequencyVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.data = [];
    this.targetData = [];
    this.initData();
    window.addEventListener('resize', function() { this.resize(); }.bind(this));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.initData();
  }

  initData() {
    const bars = 32;
    this.data = new Array(bars).fill(0);
    this.targetData = [];
    for (let i = 0; i < bars; i++) {
      this.targetData.push(randomRange(0.2, 0.9));
    }
  }

  updateBars() {
    for (let i = 0; i < this.data.length; i++) {
      if (Math.random() > 0.7) {
        this.targetData[i] = randomRange(0.1, 0.95);
      }
      this.data[i] = lerp(this.data[i], this.targetData[i], 0.15);
    }
  }

  draw() {
    const ctx = this.ctx;
    this.updateBars();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, this.width, this.height);
    const barWidth = this.width / this.data.length - 2;
    const gradient = ctx.createLinearGradient(0, this.height, 0, 0);
    gradient.addColorStop(0, '#00f5ff');
    gradient.addColorStop(0.5, '#ff00ff');
    gradient.addColorStop(1, '#ff2d95');
    var self = this;
    this.data.forEach(function(value, i) {
      const barHeight = value * self.height;
      const x = i * (barWidth + 2);
      const y = self.height - barHeight;
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#00f5ff';
      ctx.fillRect(x, y, barWidth, 2);
      ctx.shadowBlur = 0;
      const reflectionGradient = ctx.createLinearGradient(0, self.height, 0, self.height + barHeight * 0.3);
      reflectionGradient.addColorStop(0, 'rgba(0, 245, 255, 0.3)');
      reflectionGradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(x, self.height, barWidth, barHeight * 0.3);
    });
  }

  animate() {
    this.draw();
    var _this = this;
    requestAnimationFrame(function() { _this.animate(); });
  }

  start() { this.animate(); }
}

// === WAVEFORM DISPLAY ===
class WaveformDisplay {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.phase = 0;
    this.noiseOffset = 0;
    window.addEventListener('resize', function() { this.resize(); }.bind(this));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  draw() {
    const ctx = this.ctx;
    this.phase += 0.08;
    this.noiseOffset += 0.5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
    const points = [];
    for (let x = 0; x < this.width; x++) {
      const normalizedX = x / this.width;
      const wave1 = Math.sin(normalizedX * Math.PI * 8 + this.phase) * 0.4;
      const wave2 = Math.sin(normalizedX * Math.PI * 16 + this.phase * 1.5) * 0.2;
      const wave3 = Math.sin(normalizedX * Math.PI * 4 + this.phase * 0.5) * 0.3;
      const noise = (Math.sin(x * 0.1 + this.noiseOffset) + Math.sin(x * 0.23 + this.noiseOffset * 1.3)) * 0.1;
      const y = this.height / 2 + (wave1 + wave2 + wave3 + noise) * (this.height / 2 - 10);
      points.push({ x: x, y: y });
    }
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, this.height);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[points.length - 1].x, this.height);
      ctx.closePath();
      const fillGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      fillGradient.addColorStop(0, 'rgba(255, 0, 255, 0.4)');
      fillGradient.addColorStop(0.5, 'rgba(255, 45, 149, 0.1)');
      fillGradient.addColorStop(1, 'rgba(255, 0, 255, 0.4)');
      ctx.fillStyle = fillGradient;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff00ff';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  animate() {
    this.draw();
    var _this = this;
    requestAnimationFrame(function() { _this.animate(); });
  }

  start() { this.animate(); }
}

// === SHIELD ANIMATION ===
function updateShields() {
  const segments = document.querySelectorAll('.shield-segment');
  const totalEl = document.getElementById('shieldTotal');
  if (Math.random() > 0.95) {
    state.shieldIntegrity.fore = clamp(state.shieldIntegrity.fore + randomRange(-1, 1), 70, 100);
    state.shieldIntegrity.aft = clamp(state.shieldIntegrity.aft + randomRange(-1, 1), 70, 100);
    state.shieldIntegrity.port = clamp(state.shieldIntegrity.port + randomRange(-1, 1), 70, 100);
    state.shieldIntegrity.starboard = clamp(state.shieldIntegrity.starboard + randomRange(-1, 1), 70, 100);
    state.shieldIntegrity.total = Math.round((state.shieldIntegrity.fore + state.shieldIntegrity.aft + state.shieldIntegrity.port + state.shieldIntegrity.starboard) / 4);
    const total = state.shieldIntegrity.total;
    totalEl.textContent = total + '%';
    segments.forEach(function(seg, i) {
      const values = [state.shieldIntegrity.fore, state.shieldIntegrity.aft, state.shieldIntegrity.port, state.shieldIntegrity.starboard];
      const percent = values[i] / 100;
      const circumference = 2 * Math.PI * 85;
      seg.style.strokeDasharray = (circumference * percent) + ' ' + circumference;
    });
    const bars = document.querySelectorAll('.shield-reading');
    const values = [state.shieldIntegrity.fore, state.shieldIntegrity.aft, state.shieldIntegrity.port, state.shieldIntegrity.starboard];
    bars.forEach(function(bar, i) {
      bar.querySelector('.shield-bar').style.width = values[i] + '%';
      bar.querySelector('.shield-percent').textContent = values[i] + '%';
    });
  }
}

// === TARGET LOCK ANIMATION ===
function updateTargetLock() {
  const lockFill = document.getElementById('lockProgress');
  if (Math.random() > 0.98) {
    state.weapons.lockProgress = clamp(state.weapons.lockProgress + randomRange(-5, 10), 0, 100);
    lockFill.style.width = state.weapons.lockProgress + '%';
    if (state.weapons.lockProgress >= 100) {
      state.weapons.targetLocked = true;
      lockFill.style.boxShadow = '0 0 15px #39ff14';
    } else {
      state.weapons.targetLocked = false;
      lockFill.style.boxShadow = 'none';
    }
  }
}

// === WEAPON CHARGE CYCLING ===
function updateWeaponCharge() {
  const chargeFills = document.querySelectorAll('.charge-fill');
  chargeFills.forEach(function(fill) {
    let currentWidth = parseFloat(fill.style.width) || 50;
    if (Math.random() > 0.97) {
      currentWidth = clamp(currentWidth + randomRange(-10, 5), 20, 100);
      fill.style.width = currentWidth + '%';
    }
  });
}

// === SIGNAL STRENGTH ===
function updateSignalStrength() {
  if (Math.random() > 0.98) {
    state.communications.signalStrength = Math.floor(randomRange(2, 5));
    const bars = document.querySelectorAll('.signal-bar');
    bars.forEach(function(bar, i) {
      if (i < state.communications.signalStrength) {
        bar.classList.add('active');
      } else {
        bar.classList.remove('active');
      }
    });
  }
}

// === HUD UPDATES ===
function updateHUD() {
  state.navigation.velocity = clamp(state.navigation.velocity + randomRange(-0.01, 0.01), 0.5, 0.95);
  state.navigation.heading = (state.navigation.heading + randomRange(-0.1, 0.1)) % 360;
  if (state.navigation.heading < 0) state.navigation.heading += 360;
  document.querySelector('.hud-reading.velocity .hud-value').textContent = state.navigation.velocity.toFixed(2) + 'c';
  document.querySelector('.hud-reading.heading .hud-value').textContent = state.navigation.heading.toFixed(1) + '\u00B0';
}

// === SYSTEM STATUS ===
function updateSystemStatus() {
  if (Math.random() > 0.99) {
    state.systems.powerCore = clamp(state.systems.powerCore + randomRange(-0.5, 0.2), 95, 100);
    document.querySelectorAll('.system-value')[1].textContent = state.systems.powerCore.toFixed(1) + '%';
  }
}

// === BUTTON INTERACTIONS ===
function initButtonHandlers() {
  document.querySelector('.control-btn.engage').addEventListener('click', function() {
    this.classList.add('active-click');
    setTimeout(function() { this.classList.remove('active-click'); }.bind(this), 200);
    const statusEl = document.getElementById('alert-status');
    statusEl.textContent = 'WARP ENGAGED';
    statusEl.className = 'value alert-green';
    setTimeout(function() {
      statusEl.textContent = 'NOMINAL';
    }, 2000);
  });

  const fireBtn = document.getElementById('fireButton');
  let fireInterval = null;
  fireBtn.addEventListener('mousedown', function() {
    this.classList.add('firing');
    fireInterval = setInterval(function() {
      createMuzzleFlash();
      if (Math.random() > 0.3) {
        state.shieldIntegrity.total = clamp(state.shieldIntegrity.total - randomRange(1, 3), 0, 100);
      }
    }, 100);
  }.bind(fireBtn));
  fireBtn.addEventListener('mouseup', function() {
    this.classList.remove('firing');
    clearInterval(fireInterval);
  }.bind(fireBtn));
  fireBtn.addEventListener('mouseleave', function() {
    this.classList.remove('firing');
    clearInterval(fireInterval);
  }.bind(fireBtn));

  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      state.weapons.fireMode = this.textContent;
    });
  });

  document.querySelectorAll('.channel-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.channel-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      state.communications.channel = this.textContent;
    });
  });

  document.querySelectorAll('.shield-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });

  document.querySelector('.control-btn.plot').addEventListener('click', function() {
    this.style.boxShadow = '0 0 30px #00f5ff';
    setTimeout(function() { this.style.boxShadow = ''; }.bind(this), 300);
  });

  document.querySelector('.control-btn.cancel').addEventListener('click', function() {
    const statusEl = document.getElementById('alert-status');
    statusEl.textContent = 'ABORT';
    statusEl.className = 'value';
    statusEl.style.color = '#ff6b35';
    statusEl.style.textShadow = '0 0 10px #ff6b35';
    setTimeout(function() {
      statusEl.textContent = 'NOMINAL';
      statusEl.style.color = '';
      statusEl.style.textShadow = '';
    }, 1500);
  });
}

// === MUZZLE FLASH EFFECT ===
function createMuzzleFlash() {
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;top:50%;left:50%;width:100px;height:100px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,255,255,0.9) 0%,rgba(255,107,53,0.6) 30%,transparent 70%);border-radius:50%;pointer-events:none;z-index:9998;animation:flash-fade 0.1s ease-out forwards;';
  document.body.appendChild(flash);
  setTimeout(function() { flash.remove(); }, 100);
  if (!document.querySelector('#flash-style')) {
    const style = document.createElement('style');
    style.id = 'flash-style';
    style.textContent = '@keyframes flash-fade{0%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5);}}';
    document.head.appendChild(style);
  }
}

// === ALERT SYSTEM ===
function cycleAlerts() {
  const alertMessages = [
    'HOSTILE VESSEL DETECTED IN SECTOR',
    'UNIDENTIFIED SIGNAL RECEIVED',
    'WORMHOLE ANOMALY NEARBY',
    'ASTEROID FIELD IN PATH',
    'POWER FLUCTUATION DETECTED',
    'SHIELD RESONANCE UNSTABLE'
  ];
  const alertEl = document.querySelector('.alert-message');
  if (Math.random() > 0.995) {
    const newAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    alertEl.style.opacity = '0';
    setTimeout(function() {
      alertEl.textContent = newAlert;
      alertEl.style.opacity = '1';
    }, 200);
  }
}

// === MAIN INITIALIZATION ===
function init() {
  const starChart = new StarChart('starChart');
  starChart.start();
  const targetAcquisition = new TargetAcquisition('targetCanvas');
  targetAcquisition.start();
  const freqVisualizer = new FrequencyVisualizer('freqCanvas');
  freqVisualizer.start();
  const waveformDisplay = new WaveformDisplay('waveformCanvas');
  waveformDisplay.start();
  initButtonHandlers();
  setInterval(updateShipTime, 1000);
  setInterval(updateStardate, 100);
  setInterval(updateShields, 200);
  setInterval(updateTargetLock, 150);
  setInterval(updateWeaponCharge, 300);
  setInterval(updateSignalStrength, 500);
  setInterval(updateHUD, 250);
  setInterval(updateSystemStatus, 400);
  setInterval(cycleAlerts, 100);
  document.getElementById('ship-time').textContent = '00:00:00';
}

// === STARTUP ===
document.addEventListener('DOMContentLoaded', init);

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    document.getElementById('fireButton').click();
  }
  if (e.code === 'KeyW') {
    document.querySelector('.control-btn.engage').click();
  }
  if (e.code === 'Escape') {
    document.querySelector('.control-btn.cancel').click();
  }
});

// === CONSOLE BRANDING ===
console.log('%c NEBULA COMMANDER // BRIDGE CONSOLE ', 'background:linear-gradient(90deg,#00f5ff,#ff00ff);color:#000;font-weight:bold;padding:10px;font-family:monospace;');
console.log('%c Systems Online // All Stations Report Ready ', 'color:#00f5ff;font-family:monospace;');
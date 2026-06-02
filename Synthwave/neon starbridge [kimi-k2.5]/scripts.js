/* ═══════════════════════════════════════════════════════════════
   NCC-198X BRIDGE CONSOLE - SYNTHWAVE PROTOCOL
   Interactive Systems & Animation Controller
   ═══════════════════════════════════════════════════════════════ */

// ─── Canvas Contexts ───
const starfieldCanvas = document.getElementById('starfield');
const navCanvas = document.getElementById('navGrid');
const waveformCanvas = document.getElementById('waveform');

const ctxStarfield = starfieldCanvas.getContext('2d');
const ctxNav = navCanvas.getContext('2d');
const ctxWave = waveformCanvas.getContext('2d');

// ─── State Management ───
const state = {
  warpSpeed: 1,
  shieldIntegrity: 98,
  targetLocked: true,
  alertLevel: 'nominal', // nominal, yellow, red
  stardate: 1984.42,
  coordinates: { x: -402.84, y: 720.19, z: 1984.0 },
  torpedoes: 12,
  frequency: 142.8
};

// ─── Resize Handler ───
function resizeCanvases() {
  const viewport = document.querySelector('.viewport-frame');
  if (viewport) {
    starfieldCanvas.width = viewport.offsetWidth;
    starfieldCanvas.height = viewport.offsetHeight;
  }
  
  const navContainer = document.querySelector('.nav-grid-container');
  if (navContainer) {
    navCanvas.width = navContainer.offsetWidth;
    navCanvas.height = navContainer.offsetHeight;
  }
  
  const freqDisplay = document.querySelector('.frequency-display');
  if (freqDisplay) {
    waveformCanvas.width = freqDisplay.offsetWidth - 40;
    waveformCanvas.height = 60;
  }
}

window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// ═══════════════════════════════════════════════════════════════
// STARFIELD SYSTEM (Parallax Warp Drive)
// ═══════════════════════════════════════════════════════════════

class Starfield {
  constructor() {
    this.stars = [];
    this.starCount = 200;
    this.centerX = starfieldCanvas.width / 2;
    this.centerY = starfieldCanvas.height / 2;
    this.speed = 0.5;
    this.warpActive = false;
    
    this.initStars();
  }
  
  initStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * starfieldCanvas.width - this.centerX,
        y: Math.random() * starfieldCanvas.height - this.centerY,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 2 + 0.5,
        prevZ: 0
      });
    }
  }
  
  update() {
    ctxStarfield.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctxStarfield.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    
    const speed = this.warpActive ? 50 : this.speed;
    
    this.stars.forEach(star => {
      star.prevZ = star.z;
      star.z -= speed * (1000 / star.z);
      
      if (star.z <= 0) {
        star.z = 1000;
        star.x = Math.random() * starfieldCanvas.width - this.centerX;
        star.y = Math.random() * starfieldCanvas.height - this.centerY;
        star.prevZ = star.z;
      }
      
      const x = (star.x / star.z) * 500 + this.centerX;
      const y = (star.y / star.z) * 500 + this.centerY;
      const prevX = (star.x / star.prevZ) * 500 + this.centerX;
      const prevY = (star.y / star.prevZ) * 500 + this.centerY;
      
      const size = (1 - star.z / 1000) * star.size * 3;
      const opacity = (1 - star.z / 1000);
      
      // Draw star streaks when warping
      if (this.warpActive && star.z < 900) {
        ctxStarfield.beginPath();
        ctxStarfield.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctxStarfield.lineWidth = size * 0.5;
        ctxStarfield.moveTo(prevX, prevY);
        ctxStarfield.lineTo(x, y);
        ctxStarfield.stroke();
      }
      
      // Draw star
      ctxStarfield.beginPath();
      ctxStarfield.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctxStarfield.arc(x, y, size, 0, Math.PI * 2);
      ctxStarfield.fill();
      
      // Add color tint for some stars (synthwave colors)
      if (Math.random() > 0.95) {
        const colors = ['#ff00ff', '#00ffff', '#ff6b35'];
        ctxStarfield.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctxStarfield.globalAlpha = opacity * 0.5;
        ctxStarfield.fill();
        ctxStarfield.globalAlpha = 1;
      }
    });
    
    // Draw distant nebula clouds
    this.drawNebula();
  }
  
  drawNebula() {
    const time = Date.now() * 0.0001;
    const gradient = ctxStarfield.createRadialGradient(
      this.centerX + Math.sin(time) * 100, 
      this.centerY + Math.cos(time * 0.5) * 50, 
      0,
      this.centerX, 
      this.centerY, 
      300
    );
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.05)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.03)');
    gradient.addColorStop(1, 'transparent');
    
    ctxStarfield.fillStyle = gradient;
    ctxStarfield.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
  }
  
  engageWarp() {
    this.warpActive = true;
    setTimeout(() => {
      this.warpActive = false;
    }, 3000);
  }
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION GRID (3D Wireframe Projection)
// ═══════════════════════════════════════════════════════════════

class NavigationGrid {
  constructor() {
    this.offset = 0;
    this.gridSpeed = 2;
    this.pulsePhase = 0;
  }
  
  update() {
    ctxNav.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctxNav.fillRect(0, 0, navCanvas.width, navCanvas.height);
    
    const centerX = navCanvas.width / 2;
    const centerY = navCanvas.height / 2;
    const horizonY = centerY * 0.3;
    
    // Draw perspective grid lines
    ctxNav.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctxNav.lineWidth = 1;
    
    // Vertical lines converging to center
    for (let i = -5; i <= 5; i++) {
      const x = centerX + i * 40;
      ctxNav.beginPath();
      ctxNav.moveTo(x, navCanvas.height);
      ctxNav.lineTo(centerX + i * 5, horizonY);
      ctxNav.stroke();
    }
    
    // Horizontal scrolling lines
    this.offset = (this.offset + this.gridSpeed) % 40;
    
    for (let i = 0; i < 10; i++) {
      const y = navCanvas.height - ((i * 40 + this.offset) % (navCanvas.height - horizonY));
      if (y > horizonY) {
        const width = (y - horizonY) / (navCanvas.height - horizonY);
        const leftX = centerX - 200 * width;
        const rightX = centerX + 200 * width;
        
        ctxNav.beginPath();
        ctxNav.moveTo(leftX, y);
        ctxNav.lineTo(rightX, y);
        ctxNav.stroke();
      }
    }
    
    // Draw ship indicator (triangle)
    ctxNav.fillStyle = '#ff00ff';
    ctxNav.shadowBlur = 10;
    ctxNav.shadowColor = '#ff00ff';
    ctxNav.beginPath();
    ctxNav.moveTo(centerX, centerY + 20);
    ctxNav.lineTo(centerX - 10, centerY + 40);
    ctxNav.lineTo(centerX + 10, centerY + 40);
    ctxNav.closePath();
    ctxNav.fill();
    ctxNav.shadowBlur = 0;
    
    // Draw waypoint markers
    this.pulsePhase += 0.05;
    const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
    
    // Active waypoint
    ctxNav.strokeStyle = `rgba(255, 0, 255, ${pulse})`;
    ctxNav.lineWidth = 2;
    ctxNav.beginPath();
    ctxNav.arc(centerX + 30, centerY - 20, 5 * pulse, 0, Math.PI * 2);
    ctxNav.stroke();
    
    // Target waypoint
    ctxNav.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    ctxNav.beginPath();
    ctxNav.arc(centerX - 40, centerY - 40, 4, 0, Math.PI * 2);
    ctxNav.stroke();
  }
}

// ═══════════════════════════════════════════════════════════════
// WAVEFORM ANALYZER (Synthesizer Oscilloscope)
// ═══════════════════════════════════════════════════════════════

class WaveformAnalyzer {
  constructor() {
    this.phase = 0;
    this.dataPoints = [];
    this.pointCount = 50;
    
    for (let i = 0; i < this.pointCount; i++) {
      this.dataPoints.push(0);
    }
  }
  
  update() {
    ctxWave.fillStyle = 'rgba(0, 20, 20, 0.2)';
    ctxWave.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    
    const centerY = waveformCanvas.height / 2;
    
    // Generate synthetic waveform data
    this.phase += 0.1;
    this.dataPoints.shift();
    
    // Combine multiple sine waves for retro synth look
    const value = 
      Math.sin(this.phase) * 20 + 
      Math.sin(this.phase * 2.5) * 10 + 
      Math.sin(this.phase * 0.5) * 5 +
      (Math.random() - 0.5) * 5;
    
    this.dataPoints.push(value);
    
    // Draw grid lines
    ctxWave.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctxWave.lineWidth = 1;
    ctxWave.beginPath();
    ctxWave.moveTo(0, centerY);
    ctxWave.lineTo(waveformCanvas.width, centerY);
    ctxWave.stroke();
    
    // Draw waveform
    ctxWave.strokeStyle = '#00ffff';
    ctxWave.lineWidth = 2;
    ctxWave.shadowBlur = 10;
    ctxWave.shadowColor = '#00ffff';
    ctxWave.beginPath();
    
    const step = waveformCanvas.width / (this.pointCount - 1);
    
    for (let i = 0; i < this.pointCount; i++) {
      const x = i * step;
      const y = centerY + this.dataPoints[i];
      
      if (i === 0) {
        ctxWave.moveTo(x, y);
      } else {
        ctxWave.lineTo(x, y);
      }
    }
    
    ctxWave.stroke();
    ctxWave.shadowBlur = 0;
    
    // Draw glow underneath
    ctxWave.lineTo(waveformCanvas.width, centerY);
    ctxWave.lineTo(0, centerY);
    ctxWave.closePath();
    ctxWave.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctxWave.fill();
  }
}

// ═══════════════════════════════════════════════════════════════
// BRIDGE SYSTEMS (Data & Status Management)
// ═══════════════════════════════════════════════════════════════

class BridgeSystems {
  constructor() {
    this.initClock();
    this.initCoordinates();
    this.initShields();
    this.initRandomEvents();
  }
  
  initClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      document.getElementById('clock').textContent = timeStr;
      
      // Update stardate
      state.stardate += 0.001;
      document.getElementById('stardate').textContent = 
        `STARDATE: ${state.stardate.toFixed(2)}`;
    };
    
    setInterval(updateTime, 1000);
    updateTime();
  }
  
  initCoordinates() {
    setInterval(() => {
      // Subtle coordinate drift
      state.coordinates.x += (Math.random() - 0.5) * 0.1;
      state.coordinates.y += (Math.random() - 0.5) * 0.1;
      state.coordinates.z += (Math.random() - 0.5) * 0.01;
      
      document.getElementById('coordX').textContent = state.coordinates.x.toFixed(2);
      document.getElementById('coordY').textContent = state.coordinates.y.toFixed(2);
      document.getElementById('coordZ').textContent = state.coordinates.z.toFixed(1);
    }, 2000);
  }
  
  initShields() {
    setInterval(() => {
      // Random shield fluctuations
      const change = (Math.random() - 0.5) * 2;
      state.shieldIntegrity = Math.max(0, Math.min(100, state.shieldIntegrity + change));
      
      const shieldValue = Math.floor(state.shieldIntegrity);
      document.getElementById('shieldValue').textContent = `${shieldValue}%`;
      
      // Update shield bars
      document.querySelectorAll('.shield-bar .fill').forEach(bar => {
        const variance = Math.random() * 5 - 2.5;
        const width = Math.max(0, Math.min(100, shieldValue + variance));
        bar.style.width = `${width}%`;
      });
      
      // Color shift based on integrity
      const shieldText = document.getElementById('shieldValue');
      if (shieldValue < 50) {
        shieldText.style.color = '#ff0000';
        shieldText.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
      } else if (shieldValue < 75) {
        shieldText.style.color = '#ffaa00';
        shieldText.style.textShadow = '0 0 10px rgba(255, 170, 0, 0.8)';
      }
    }, 3000);
  }
  
  initRandomEvents() {
    const events = [
      { msg: 'Sensor sweep complete. No anomalies detected.', type: 'normal' },
      { msg: 'Warp field fluctuations within normal parameters.', type: 'normal' },
      { msg: 'Incoming transmission from Starfleet Command...', type: 'incoming' },
      { msg: 'Warning: Minor radiation spike detected.', type: 'warning' },
      { msg: 'Navigation beacon synchronized.', type: 'normal' }
    ];
    
    setInterval(() => {
      if (Math.random() > 0.7) {
        const event = events[Math.floor(Math.random() * events.length)];
        this.logToTerminal(event.msg, event.type);
      }
    }, 8000);
  }
  
  logToTerminal(message, type = 'normal') {
    const terminal = document.getElementById('terminalOutput');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    line.textContent = `[${time}] ${message}`;
    
    if (type === 'warning') line.classList.add('warning');
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Keep only last 20 lines
    while (terminal.children.length > 20) {
      terminal.removeChild(terminal.firstChild);
    }
  }
  
  setAlert(level) {
    const status = document.getElementById('alertStatus');
    const body = document.body;
    
    state.alertLevel = level;
    
    if (level === 'red') {
      status.textContent = 'RED ALERT';
      status.style.color = '#ff0000';
      status.style.textShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
      body.style.boxShadow = 'inset 0 0 100px rgba(255, 0, 0, 0.3)';
      this.logToTerminal('RED ALERT! All hands to battle stations!', 'warning');
    } else if (level === 'yellow') {
      status.textContent = 'YELLOW ALERT';
      status.style.color = '#ffaa00';
      status.style.textShadow = '0 0 20px rgba(255, 170, 0, 0.8)';
      this.logToTerminal('Yellow alert. Stand by.', 'warning');
    } else {
      status.textContent = 'SYSTEM NOMINAL';
      status.style.color = '#00ff00';
      status.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
      body.style.boxShadow = 'none';
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// WEAPONS SYSTEMS (Targeting & Fire Control)
// ═══════════════════════════════════════════════════════════════

class WeaponsSystem {
  constructor() {
    this.reticle = document.getElementById('targetingReticle');
    this.fireBtn = document.getElementById('fireBtn');
    this.lockDisplay = document.getElementById('lockDisplay');
    this.isScanning = true;
    
    this.initTargeting();
    this.initFireControl();
  }
  
  initTargeting() {
    // Autonomous scanning animation
    let angle = 0;
    setInterval(() => {
      if (state.targetLocked) {
        this.reticle.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(1)`;
        angle += 0.5;
      }
    }, 50);
    
    // Random target distance updates
    setInterval(() => {
      if (state.targetLocked) {
        const distance = 28000 + Math.floor(Math.random() * 1000);
        document.querySelector('.range-value').textContent = distance;
      }
    }, 1000);
  }
  
  initFireControl() {
    this.fireBtn.addEventListener('click', () => {
      if (!state.targetLocked) {
        this.acquireTarget();
      } else {
        this.fireWeapons();
      }
    });
    
    // Click on viewport to manual target
    document.querySelector('.viewport-frame').addEventListener('click', (e) => {
      this.moveReticle(e);
    });
  }
  
  acquireTarget() {
    this.fireBtn.textContent = 'ACQUIRING...';
    this.fireBtn.disabled = true;
    
    this.logToTerminal('Target acquisition in progress...', 'normal');
    
    setTimeout(() => {
      state.targetLocked = true;
      this.fireBtn.textContent = 'DISENGAGE';
      this.fireBtn.disabled = false;
      this.fireBtn.classList.add('armed');
      this.lockDisplay.style.borderColor = '#ff00ff';
      this.logToTerminal('TARGET LOCKED. Weapons armed.', 'warning');
    }, 2000);
  }
  
  fireWeapons() {
    if (state.torpedoes > 0) {
      state.torpedoes--;
      document.getElementById('torpCount').textContent = state.torpedoes;
      
      this.logToTerminal(`Photon torpedo away! ${state.torpedoes} remaining.`, 'warning');
      
      // Visual feedback
      const viewport = document.querySelector('.viewport-frame');
      viewport.style.boxShadow = '0 0 50px rgba(255, 0, 0, 0.8)';
      setTimeout(() => {
        viewport.style.boxShadow = '';
      }, 300);
      
      if (state.torpedoes === 0) {
        this.fireBtn.textContent = 'RELOADING...';
        this.fireBtn.disabled = true;
        
        setTimeout(() => {
          state.torpedoes = 12;
          document.getElementById('torpCount').textContent = state.torpedoes;
          this.fireBtn.textContent = 'DISENGAGE';
          this.fireBtn.disabled = false;
          this.logToTerminal('Torpedo bay reloaded.', 'normal');
        }, 5000);
      }
    }
  }
  
  moveReticle(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    this.reticle.style.left = `${x}%`;
    this.reticle.style.top = `${y}%`;
    this.reticle.style.transform = 'translate(-50%, -50%)';
  }
  
  logToTerminal(msg, type) {
    window.bridgeSystems.logToTerminal(msg, type);
  }
}

// ═══════════════════════════════════════════════════════════════
// TERMINAL INTERFACE (Command Processing)
// ═══════════════════════════════════════════════════════════════

class TerminalInterface {
  constructor() {
    this.input = document.getElementById('terminalInput');
    this.output = document.getElementById('terminalOutput');
    this.commands = {
      'help': () => this.print('Available commands: warp, shields, redalert, yellowalert, secure, status, clear'),
      'warp': () => this.engageWarp(),
      'shields': () => this.toggleShields(),
      'redalert': () => window.bridgeSystems.setAlert('red'),
      'yellowalert': () => window.bridgeSystems.setAlert('yellow'),
      'secure': () => window.bridgeSystems.setAlert('nominal'),
      'status': () => this.printStatus(),
      'clear': () => this.clearTerminal(),
      'engage': () => this.engageWarp(),
      'fire': () => this.manualFire()
    };
    
    this.initInput();
  }
  
  initInput() {
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.toLowerCase().trim();
        this.input.value = '';
        
        this.print(`> ${cmd}`, 'command');
        
        if (this.commands[cmd]) {
          this.commands[cmd]();
        } else if (cmd !== '') {
          this.print(`Command not recognized: ${cmd}`, 'error');
        }
      }
    });
    
    this.input.focus();
    document.addEventListener('click', (e) => {
      if (e.target === this.input || e.target.closest('.terminal-container')) {
        this.input.focus();
      }
    });
  }
  
  print(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    
    if (type === 'error') line.style.color = '#ff0000';
    if (type === 'command') line.style.color = '#00ffff';
    
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }
  
  engageWarp() {
    this.print('Engaging warp drive...', 'normal');
    window.starfield.engageWarp();
    window.bridgeSystems.logToTerminal('Warp drive engaged. Speed: Warp 7.5');
    
    // Visual effect on grid
    document.querySelector('.chrome-grid-floor').style.animationDuration = '2s';
    setTimeout(() => {
      document.querySelector('.chrome-grid-floor').style.animationDuration = '20s';
    }, 3000);
  }
  
  toggleShields() {
    state.shieldIntegrity = state.shieldIntegrity > 50 ? 25 : 98;
    this.print(`Shields ${state.shieldIntegrity > 50 ? 'raised' : 'lowered'}. Integrity: ${state.shieldIntegrity}%`);
  }
  
  printStatus() {
    this.print(`Shields: ${Math.floor(state.shieldIntegrity)}%`);
    this.print(`Torpedoes: ${state.torpedoes}`);
    this.print(`Coordinates: ${state.coordinates.x.toFixed(1)}, ${state.coordinates.y.toFixed(1)}`);
    this.print(`Alert Level: ${state.alertLevel.toUpperCase()}`);
  }
  
  clearTerminal() {
    this.output.innerHTML = '';
    this.print('Terminal cleared.');
  }
  
  manualFire() {
    if (window.weaponsSystem) {
      window.weaponsSystem.fireWeapons();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function init() {
  // Initialize systems
  window.starfield = new Starfield();
  const navGrid = new NavigationGrid();
  const waveform = new WaveformAnalyzer();
  window.bridgeSystems = new BridgeSystems();
  window.weaponsSystem = new WeaponsSystem();
  const terminal = new TerminalInterface();
  
  // Animation Loop
  function animate() {
    window.starfield.update();
    navGrid.update();
    waveform.update();
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Navigation button handlers
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      window.bridgeSystems.logToTerminal(`Course set to ${this.dataset.course.toUpperCase()}`);
    });
  });
  
  // Channel select handlers
  document.querySelectorAll('.channel').forEach(ch => {
    ch.addEventListener('click', function() {
      document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const freq = 140 + Math.random() * 20;
      document.getElementById('freqValue').textContent = `${freq.toFixed(1)} THz`;
    });
  });
  
  console.log('NCC-198X BRIDGE SYSTEMS ONLINE');
  console.log('Synthwave Protocol Initialized');
}

// Boot sequence
document.addEventListener('DOMContentLoaded', init);
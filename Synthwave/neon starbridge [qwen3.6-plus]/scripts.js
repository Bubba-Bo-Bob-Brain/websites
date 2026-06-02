/* ═══════════════════════════════════════════════════════════
   USS CHRONOS — BRIDGE CONSOLE SCRIPTS
   Functionality: Clock, Starfield, Canvas Visualizations, 
   Data Simulation, Interactive Elements
   ═══════════════════════════════════════════════════════════ */

// ──── 1. Utility Functions ────
const Utils = {
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
  
  randomInt(min, max) {
    return Math.floor(this.random(min, max + 1));
  },
  
  formatTime(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },
  
  formatClock(date) {
    return date.toTimeString().split(' ')[0];
  },
  
  getElement(id) {
    return document.getElementById(id);
  }
};

// ──── 2. Clock System ────
const ClockSystem = {
  startTime: Date.now(),
  
  init() {
    setInterval(() => this.update(), 1000);
  },
  
  update() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    Utils.getElement('mission-clock').textContent = Utils.formatTime(elapsed);
    Utils.getElement('ship-time').textContent = Utils.formatClock(new Date());
  }
};

// ──── 3. Star Field Generator ────
const StarField = {
  layers: ['stars-far', 'stars-mid', 'stars-near'],
  
  init() {
    this.layers.forEach(layerId => {
      this.generateStars(layerId);
    });
  },
  
  generateStars(containerId) {
    const container = Utils.getElement(containerId);
    if (!container) return;
    
    // Clear existing
    container.innerHTML = '';
    
    const count = containerId === 'stars-near' ? 40 : containerId === 'stars-mid' ? 25 : 15;
    
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = `${Utils.random(0, 100)}%`;
      star.style.top = `${Utils.random(0, 100)}%`;
      star.style.width = `${Utils.random(1, 3)}px`;
      star.style.height = star.style.width;
      star.style.borderRadius = '50%';
      star.style.background = '#fff';
      star.style.opacity = Utils.random(0.3, 0.9);
      star.style.boxShadow = `0 0 ${Utils.random(2, 4)}px rgba(255,255,255,0.8)`;
      
      // Add slight twinkle animation
      const duration = Utils.random(2, 6);
      star.style.animation = `pulse ${duration}s infinite alternate`;
      
      container.appendChild(star);
    }
  }
};

// ──── 4. Canvas Visualizations ────
const Visualizations = {
  animations: [],
  
  init() {
    this.initStarMap();
    this.initFrequencyDisplay();
    this.initShieldHarmonics();
    this.initWaveform();
    this.startLoop();
  },
  
  startLoop() {
    const loop = () => {
      this.animations.forEach(anim => anim());
      requestAnimationFrame(loop);
    };
    loop();
  },
  
  initStarMap() {
    const canvas = Utils.getElement('starmap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const blips = Array.from({ length: 15 }, () => ({
      x: Utils.random(10, canvas.width - 10),
      y: Utils.random(10, canvas.height - 10),
      speed: Utils.random(0.1, 0.5),
      angle: Utils.random(0, Math.PI * 2),
      size: Utils.random(1, 3)
    }));
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for(let i = 0; i < canvas.width; i += 20) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
      for(let i = 0; i < canvas.height; i += 20) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
      ctx.stroke();
      
      // Ship center
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Blips
      blips.forEach(blip => {
        blip.x += Math.cos(blip.angle) * blip.speed;
        blip.y += Math.sin(blip.angle) * blip.speed;
        
        if(blip.x < 0 || blip.x > canvas.width) blip.angle = Math.PI - blip.angle;
        if(blip.y < 0 || blip.y > canvas.height) blip.angle = -blip.angle;
        
        ctx.fillStyle = '#ff00aa';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff00aa';
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    
    this.animations.push(animate);
  },
  
  initFrequencyDisplay() {
    const canvas = Utils.getElement('freq-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const bars = 32;
    const barData = Array.from({ length: bars }, () => ({ height: 0.2, target: 0.2, speed: Utils.random(0.01, 0.05) }));
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bars;
      
      barData.forEach((bar, i) => {
        // Update height randomly
        if (Math.random() < 0.05) {
          bar.target = Utils.random(0.1, 0.9);
        }
        
        bar.height += (bar.target - bar.height) * bar.speed * 10;
        
        const h = bar.height * canvas.height;
        const x = i * barWidth;
        const y = canvas.height - h;
        
        // Gradient color based on height
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(0.5, '#9d00ff');
        gradient.addColorStop(1, '#ff00aa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, h);
        
        // Peak line
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 1, y - 2, barWidth - 2, 1);
      });
    };
    
    this.animations.push(animate);
  },
  
  initShieldHarmonics() {
    const canvas = Utils.getElement('harmonics-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    let phase = 0;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#00ff66';
      
      const amplitude = canvas.height * 0.3;
      const frequency = 0.05;
      const speed = 0.05;
      
      phase += speed;
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * frequency + phase) * amplitude * Math.sin(phase * 0.5) + 
                  Math.sin(x * frequency * 2.5 + phase * 1.5) * amplitude * 0.3;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    
    this.animations.push(animate);
  },
  
  initWaveform() {
    const canvas = Utils.getElement('waveform-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    let offset = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ff00aa';
      
      offset += 2;
      
      for (let x = 0; x < canvas.width; x++) {
        // Simulate audio wave
        const wave1 = Math.sin((x + offset) * 0.05) * 15;
        const wave2 = Math.sin((x + offset * 1.3) * 0.02) * 20;
        const noise = (Math.random() - 0.5) * 5;
        const y = canvas.height / 2 + wave1 + wave2 + noise;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    this.animations.push(animate);
  }
};

// ──── 5. Data Simulator ────
const DataSimulator = {
  shieldIntegrity: 90,
  
  init() {
    setInterval(() => this.updateCoordinates(), 2000);
    setInterval(() => this.updateVelocity(), 3000);
    setInterval(() => this.updateShieldIntegrity(), 4000);
    setInterval(() => this.updateSignalStrength(), 2500);
    setInterval(() => this.updateLatency(), 5000);
    setInterval(() => this.updatePowerLevel(), 6000);
  },
  
  updateCoordinates() {
    const x = Utils.random(-5000, -4000).toFixed(2);
    const y = Utils.random(1000, 2000).toFixed(2);
    const z = Utils.random(500, 800).toFixed(2);
    
    Utils.getElement('coord-x').textContent = `-${x}`;
    Utils.getElement('coord-y').textContent = `+${y}`;
    Utils.getElement('coord-z').textContent = `+${z}`;
  },
  
  updateVelocity() {
    const vel = Utils.random(1500000, 1600000).toFixed(0);
    Utils.getElement('velocity-value').innerHTML = `${parseInt(vel).toLocaleString()} <span class="velocity-unit">km/s</span>`;
    
    const fillPercent = Utils.random(60, 75);
    Utils.getElement('velocity-fill').style.width = `${fillPercent}%`;
  },
  
  updateShieldIntegrity() {
    // Fluctuate slightly
    this.shieldIntegrity = Math.max(75, Math.min(100, this.shieldIntegrity + Utils.randomInt(-2, 1)));
    Utils.getElement('shield-integrity-value').textContent = `${this.shieldIntegrity}%`;
    
    // Update SVG rings
    const mainRing = Utils.getElement('shield-main-ring');
    const secondaryRing = Utils.getElement('shield-secondary-ring');
    const innerRing = Utils.getElement('shield-inner-ring');
    
    // Circumference approximations: 2*pi*r
    const mainC = 2 * Math.PI * 80;
    const secC = 2 * Math.PI * 65;
    const innerC = 2 * Math.PI * 50;
    
    const offsetMain = mainC - (mainC * this.shieldIntegrity / 100);
    const offsetSec = secC - (secC * this.shieldIntegrity / 100);
    const offsetInner = innerC - (innerC * this.shieldIntegrity / 100);
    
    mainRing.style.strokeDashoffset = offsetMain;
    secondaryRing.style.strokeDashoffset = offsetSec;
    innerRing.style.strokeDashoffset = offsetInner;
    
    // Update sector bars
    const sectors = ['fore', 'aft', 'port', 'starboard'];
    sectors.forEach(sector => {
      const val = Math.max(60, Math.min(100, this.shieldIntegrity + Utils.randomInt(-5, 5)));
      Utils.getElement(`sector-${sector}`).style.width = `${val}%`;
    });
  },
  
  updateSignalStrength() {
    const channels = ['signal-alpha', 'signal-beta', 'signal-gamma'];
    channels.forEach(id => {
      const container = Utils.getElement(id);
      if (!container) return;
      const bars = container.querySelectorAll('.signal-bar');
      const activeCount = Utils.randomInt(1, 8);
      
      bars.forEach((bar, idx) => {
        if (idx < activeCount) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    });
  },
  
  updateLatency() {
    const latency = Utils.random(0.001, 0.015).toFixed(3);
    Utils.getElement('tx-latency').textContent = `${latency}s`;
  },
  
  updatePowerLevel() {
    const power = Utils.random(85, 98).toFixed(0);
    Utils.getElement('power-fill').style.width = `${power}%`;
    document.querySelector('.power-value').textContent = `${power}%`;
  }
};

// ──── 6. Interactive Elements ────
const Interactions = {
  init() {
    // Fire Control Buttons
    const fireModes = document.querySelectorAll('.fire-mode');
    fireModes.forEach(btn => {
      btn.addEventListener('click', () => {
        fireModes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Visual feedback: brief flash on reticle
        const lock = Utils.getElement('reticle-lock');
        lock.style.stroke = '#ff00aa';
        lock.style.strokeWidth = '4';
        setTimeout(() => {
          lock.style.stroke = '#ff3333';
          lock.style.strokeWidth = '2';
        }, 200);
      });
    });
    
    // Initial active state
    const singleBtn = Utils.getElement('fire-single');
    if(singleBtn) singleBtn.classList.add('active');
  }
};

// ──── 7. Initialize Everything ────
document.addEventListener('DOMContentLoaded', () => {
  ClockSystem.init();
  StarField.init();
  Visualizations.init();
  DataSimulator.init();
  Interactions.init();
  
  console.log('%c USS CHRONOS BRIDGE CONSOLE ONLINE ', 'background: #000; color: #00f0ff; font-size: 16px; padding: 4px 8px; border: 1px solid #00f0ff;');
});
// 1940s Alternate History Military Command War Room - JavaScript

class WarRoomController {
  constructor() {
    this.unitMarkers = document.querySelectorAll('.unit-marker');
    this.propagandaTrack = document.getElementById('propaganda-track');
    this.carouselDots = document.querySelectorAll('.carousel-dot');
    this.interceptLog = document.getElementById('intercept-log');
    this.addInterceptBtn = document.getElementById('add-intercept');
    this.clearInterceptsBtn = document.getElementById('clear-intercepts');
    this.commandNotes = document.getElementById('command-notes');
    this.lastInterceptTime = document.getElementById('last-intercept-time');
    this.overheadLamp = document.getElementById('overhead-lamp');
    
    // Gauge elements
    this.gaugeMorale = document.getElementById('gauge-morale');
    this.gaugeSupply = document.getElementById('gauge-supply');
    this.gaugeEnemy = document.getElementById('gauge-enemy');
    this.gaugeAllocation = document.getElementById('gauge-allocation');
    
    // Production quota elements
    this.steelFill = document.getElementById('steel-fill');
    this.fuelFill = document.getElementById('fuel-fill');
    this.munitionsFill = document.getElementById('munitions-fill');
    this.aircraftFill = document.getElementById('aircraft-fill');
    this.manpowerFill = document.getElementById('manpower-fill');
    
    // Status lights
    this.statusAllClear = document.getElementById('status-all-clear');
    this.statusAlert = document.getElementById('status-alert');
    this.statusRaid = document.getElementById('status-raid');
    
    // Time elements
    this.timeDisplay = document.querySelector('.time-display');
    this.dateDisplay = document.querySelector('.date-display');
    
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.isDragging = false;
    this.draggedElement = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.interceptChannels = [
      'CH 7 / ENIGMA-A',
      'CH 3 / NAVAL',
      'CH 12 / PARTISAN',
      'CH 9 / AIR FORCE',
      'CH 15 / SIGINT',
      'CH 2 / FIELD OPS'
    ];
    
    this.interceptTemplates = [
      '...ENEMY ARMOR COLUMN MOVING {direction} ALONG ROUTE {route}... ESTIMATED {count} TANKS... REQUESTING AIR RECON...',
      '...CONVOY {convoy} REPORTING U-BOAT ACTIVITY {location}... REQUESTING ESCORT DESTROYERS...',
      '...RAIL BRIDGE AT {location} DESTROYED... ENEMY SUPPLY LINE DISRUPTED FOR {hours} HOURS...',
      '...ENEMY AIRFIELD AT {location} BOMBED... {count} AIRCRAFT DESTROYED ON GROUND...',
      '...PARTISAN FORCES REPORT {location} SUPPLY DEPOT HIT... ESTIMATED {count} CASUALTIES...',
      '...NAVAL ENCOUNTER {location}... {count} SHIPS SUNK... REQUESTING SUBMARINE PATROL...',
      '...ENEMY RADIO TRAFFIC INDICATES PLANNED OFFENSIVE {direction} OF {location}... ESTIMATED {count} DIVISIONS...',
      '...CODE BREAKERS INTERCEPT MESSAGE: OPERATION {operation} SCHEDULED FOR {date}...'
    ];
    
    this.locations = ['KRAKOW', 'STALINGRAD', 'NORMANDY', 'EL ALAMEIN', 'MIDWAY', 'CORAL SEA', 'BULGE', 'ANZIO'];
    this.directions = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'SOUTHWEST'];
    this.routes = ['66', '9', '20', '101', '1', '30'];
    this.operations = ['BARBAROSSA', 'SEELÖWE', 'ZITADELLE', 'OVERLORD', 'TORCH', 'HUSKY'];
    
    this.init();
  }
  
  init() {
    this.setupDraggableUnits();
    this.setupPropagandaCarousel();
    this.setupRadioIntercepts();
    this.setupCommandNotes();
    this.startClock();
    this.startGaugeAnimations();
    this.startProductionUpdates();
    this.startStatusLightCycle();
    this.setupLampFlicker();
    this.addInitialIntercepts();
    
    // Add some initial randomness to gauges
    this.updateGauges();
  }
  
  // Unit Dragging System
  setupDraggableUnits() {
    this.unitMarkers.forEach(marker => {
      marker.addEventListener('mousedown', (e) => this.startDrag(e, marker));
      marker.addEventListener('touchstart', (e) => this.startDrag(e, marker), { passive: false });
    });
    
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
    
    document.addEventListener('mouseup', () => this.endDrag());
    document.addEventListener('touchend', () => this.endDrag());
  }
  
  startDrag(e, marker) {
    e.preventDefault();
    this.isDragging = true;
    this.draggedElement = marker;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = marker.getBoundingClientRect();
    this.dragOffset.x = clientX - rect.left;
    this.dragOffset.y = clientY - rect.top;
    
    marker.style.cursor = 'grabbing';
    marker.style.zIndex = '100';
    marker.style.transform = 'scale(1.1)';
  }
  
  drag(e) {
    if (!this.isDragging || !this.draggedElement) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const mapContainer = document.querySelector('.map-table');
    const mapRect = mapContainer.getBoundingClientRect();
    
    let x = clientX - mapRect.left - this.dragOffset.x;
    let y = clientY - mapRect.top - this.dragOffset.y;
    
    // Constrain to map boundaries
    x = Math.max(0, Math.min(x, mapRect.width - 60));
    y = Math.max(0, Math.min(y, mapRect.height - 60));
    
    this.draggedElement.style.left = `${x}px`;
    this.draggedElement.style.top = `${y}px`;
    this.draggedElement.style.gridColumn = 'auto';
    this.draggedElement.style.gridRow = 'auto';
  }
  
  endDrag() {
    if (this.draggedElement) {
      this.draggedElement.style.cursor = 'grab';
      this.draggedElement.style.zIndex = '5';
      this.draggedElement.style.transform = 'scale(1)';
      
      // Snap to grid
      this.snapToGrid(this.draggedElement);
    }
    this.isDragging = false;
    this.draggedElement = null;
  }
  
  snapToGrid(element) {
    const mapTable = document.querySelector('.map-table');
    const mapRect = mapTable.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const cellWidth = mapRect.width / 10;
    const cellHeight = mapRect.height / 10;
    
    const centerX = elementRect.left + elementRect.width / 2 - mapRect.left;
    const centerY = elementRect.top + elementRect.height / 2 - mapRect.top;
    
    const gridX = Math.round(centerX / cellWidth);
    const gridY = Math.round(centerY / cellHeight);
    
    const clampedX = Math.max(0, Math.min(gridX, 9));
    const clampedY = Math.max(0, Math.min(gridY, 9));
    
    const snapX = (clampedX * cellWidth) + (cellWidth / 2) - 30;
    const snapY = (clampedY * cellHeight) + (cellHeight / 2) - 30;
    
    element.style.left = `${snapX}px`;
    element.style.top = `${snapY}px`;
  }
  
  // Propaganda Carousel
  setupPropagandaCarousel() {
    this.carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.dataset.slide);
        this.goToSlide(slideIndex);
      });
    });
    
    // Auto-advance every 8 seconds
    setInterval(() => {
      this.nextSlide();
    }, 8000);
  }
  
  goToSlide(index) {
    this.currentSlide = index;
    
    // Update posters
    const posters = document.querySelectorAll('.propaganda-poster');
    posters.forEach((poster, i) => {
      poster.classList.toggle('active', i === index);
    });
    
    // Update dots
    this.carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  nextSlide() {
    const next = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(next);
  }
  
  // Radio Intercepts System
  setupRadioIntercepts() {
    this.addInterceptBtn.addEventListener('click', () => {
      this.addNewIntercept();
    });
    
    this.clearInterceptsBtn.addEventListener('click', () => {
      this.clearIntercepts();
    });
  }
  
  addInitialIntercepts() {
    // Add a few initial intercepts with stagger
    setTimeout(() => this.addNewIntercept(), 1000);
    setTimeout(() => this.addNewIntercept(), 2500);
    setTimeout(() => this.addNewIntercept(), 4000);
  }
  
  addNewIntercept() {
    const template = this.interceptTemplates[Math.floor(Math.random() * this.interceptTemplates.length)];
    const channel = this.interceptChannels[Math.floor(Math.random() * this.interceptChannels.length)];
    
    // Fill in template variables
    let text = template
      .replace('{direction}', this.randomChoice(this.directions))
      .replace('{route}', this.randomChoice(this.routes))
      .replace('{count}', Math.floor(Math.random() * 100) + 10)
      .replace('{convoy}', `PQ-${Math.floor(Math.random() * 20) + 1}`)
      .replace('{location}', this.randomChoice(this.locations))
      .replace('{hours}', Math.floor(Math.random() * 72) + 1)
      .replace('{operation}', this.randomChoice(this.operations))
      .replace('{date}', `${Math.floor(Math.random() * 28) + 1} ${this.randomChoice(['MARCH', 'APRIL', 'MAY'])} 1943`);
    
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0] + ' ZULU';
    
    const entry = document.createElement('div');
    entry.className = 'intercept-entry';
    entry.innerHTML = `
      <span class="intercept-time">${timeString}</span>
      <span class="intercept-channel">${channel}</span>
      <p class="intercept-text">${text}</p>
    `;
    
    // Add to top of log
    this.interceptLog.insertBefore(entry, this.interceptLog.firstChild);
    
    // Update last intercept time
    this.lastInterceptTime.textContent = timeString;
    
    // Keep only last 20 entries
    const entries = this.interceptLog.querySelectorAll('.intercept-entry');
    if (entries.length > 20) {
      entries[entries.length - 1].remove();
    }
    
    // Flash effect on new entry
    entry.style.background = 'rgba(181, 166, 66, 0.2)';
    setTimeout(() => {
      entry.style.background = 'rgba(0,0,0,0.3)';
    }, 500);
  }
  
  clearIntercepts() {
    this.interceptLog.innerHTML = '';
    this.addNewIntercept();
  }
  
  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  // Command Notes
  setupCommandNotes() {
    // Make notes editable with double-click
    this.commandNotes.addEventListener('dblclick', () => {
      this.commandNotes.readOnly = !this.commandNotes.readOnly;
      if (!this.commandNotes.readOnly) {
        this.commandNotes.focus();
      }
    });
    
    // Save notes to localStorage
    this.commandNotes.addEventListener('blur', () => {
      localStorage.setItem('warRoomNotes', this.commandNotes.value);
    });
    
    // Load saved notes
    const savedNotes = localStorage.getItem('warRoomNotes');
    if (savedNotes) {
      this.commandNotes.value = savedNotes;
    }
  }
  
  // Clock System
  startClock() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }
  
  updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    this.timeDisplay.textContent = `${hours}:${minutes}:${seconds} ZULU`;
    
    // Update date occasionally (simulate time passing)
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                   'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    
    this.dateDisplay.textContent = `${day} ${month} ${year}`;
  }
  
  // Gauge Animations
  startGaugeAnimations() {
    // Update gauges every 3-5 seconds with random fluctuations
    setInterval(() => {
      this.updateGauges();
    }, 3000);
  }
  
  updateGauges() {
    // Morale: 60-90%
    const morale = 60 + Math.random() * 30;
    this.gaugeMorale.style.setProperty('--needle-angle', `${60 + (morale / 100) * 120}deg`);
    
    // Supply Lines: 40-80%
    const supply = 40 + Math.random() * 40;
    this.gaugeSupply.style.setProperty('--needle-angle', `${60 + (supply / 100) * 120}deg`);
    
    // Enemy Activity: 70-100%
    const enemy = 70 + Math.random() * 30;
    this.gaugeEnemy.style.setProperty('--needle-angle', `${60 + (enemy / 100) * 120}deg`);
    
    // Resource Allocation: 50-90%
    const allocation = 50 + Math.random() * 40;
    this.gaugeAllocation.style.setProperty('--needle-angle', `${60 + (allocation / 100) * 120}deg`);
  }
  
  // Production Quota Updates
  startProductionUpdates() {
    setInterval(() => {
      this.updateProduction();
    }, 5000);
  }
  
  updateProduction() {
    // Steel: 70-95%
    const steelPercent = 70 + Math.random() * 25;
    this.steelFill.style.width = `${steelPercent}%`;
    document.getElementById('steel-current').textContent = Math.floor(1200 * (steelPercent / 100));
    
    // Fuel: 55-85%
    const fuelPercent = 55 + Math.random() * 30;
    this.fuelFill.style.width = `${fuelPercent}%`;
    document.getElementById('fuel-current').textContent = Math.floor(2000 * (fuelPercent / 100));
    
    // Munitions: 60-90%
    const munitionsPercent = 60 + Math.random() * 30;
    this.munitionsFill.style.width = `${munitionsPercent}%`;
    document.getElementById('munitions-current').textContent = Math.floor(50000 * (munitionsPercent / 100));
    
    // Aircraft: 50-80%
    const aircraftPercent = 50 + Math.random() * 30;
    this.aircraftFill.style.width = `${aircraftPercent}%`;
    document.getElementById('aircraft-current').textContent = Math.floor(40 * (aircraftPercent / 100));
    
    // Manpower: 75-95%
    const manpowerPercent = 75 + Math.random() * 20;
    this.manpowerFill.style.width = `${manpowerPercent}%`;
    document.getElementById('manpower-current').textContent = Math.floor(15000 * (manpowerPercent / 100));
    
    // Color coding based on percentage
    this.updateQuotaColor(this.steelFill, steelPercent);
    this.updateQuotaColor(this.fuelFill, fuelPercent);
    this.updateQuotaColor(this.munitionsFill, munitionsPercent);
    this.updateQuotaColor(this.aircraftFill, aircraftPercent);
    this.updateQuotaColor(this.manpowerFill, manpowerPercent);
  }
  
  updateQuotaColor(element, percent) {
    if (percent < 60) {
      element.style.background = 'linear-gradient(90deg, #8b0000 0%, #c62828 100%)';
    } else if (percent < 80) {
      element.style.background = 'linear-gradient(90deg, #d4a017 0%, #f9a825 100%)';
    } else {
      element.style.background = 'linear-gradient(90deg, #2d5a27 0%, #4caf50 100%)';
    }
  }
  
  // Status Light Cycle
  startStatusLightCycle() {
    // Randomly activate status lights
    setInterval(() => {
      const random = Math.random();
      
      // Reset all
      this.statusAllClear.classList.remove('active');
      this.statusAlert.classList.remove('active');
      this.statusRaid.classList.remove('active');
      
      // Activate one based on random chance
      if (random < 0.6) {
        this.statusAllClear.classList.add('active');
      } else if (random < 0.9) {
        this.statusAlert.classList.add('active');
      } else {
        this.statusRaid.classList.add('active');
      }
    }, 10000);
  }
  
  // Overhead Lamp Flicker
  setupLampFlicker() {
    // Additional random flickers beyond CSS animation
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.overheadLamp.style.opacity = '0.7';
        setTimeout(() => {
          this.overheadLamp.style.opacity = '1';
        }, 100);
      }
    }, 2000);
  }
}

// Sound Effects Controller (optional, creates atmosphere)
class SoundController {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
  }
  
  init() {
    // Create audio context on first user interaction
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    }, { once: true });
  }
  
  playClickSound() {
    if (!this.audioContext || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  playAlertSound() {
    if (!this.audioContext || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const warRoom = new WarRoomController();
  const soundController = new SoundController();
  soundController.init();
  
  // Add click sounds to buttons
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      soundController.playClickSound();
    });
  });
  
  // Add subtle ambient effects
  console.log('%c🎖️ ALLIED HIGH COMMAND WAR ROOM INITIALIZED 🎖️', 
    'color: #b5a642; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;');
  console.log('%c⚡ Systems Online • Communications Secure • Map Calibrated ⚡', 
    'color: #4caf50; font-size: 12px;');
  
  // Easter egg: Konami code for "SECRET" mode
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        this.activateSecretMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
});

// Secret mode easter egg
WarRoomController.prototype.activateSecretMode = function() {
  document.body.style.filter = 'sepia(0.3) contrast(1.1)';
  document.querySelector('.war-room').style.boxShadow = 'inset 0 0 100px rgba(181, 166, 66, 0.2)';
  
  // Flash all status lights
  const lights = document.querySelectorAll('.status-light');
  lights.forEach(light => {
    light.style.animation = 'redAlert 0.5s ease-in-out 3';
  });
  
  setTimeout(() => {
    document.body.style.filter = '';
    document.querySelector('.war-room').style.boxShadow = '';
    lights.forEach(light => {
      light.style.animation = '';
    });
  }, 3000);
  
  console.log('%c🛡️ CLASSIFIED: ENIGMA CODES BREACHED - ENEMY PLANS REVEALED 🛡️', 
    'color: #ff4444; font-size: 14px; font-weight: bold;');
};

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Spacebar to add new intercept
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    const warRoom = new WarRoomController();
    warRoom.addNewIntercept();
  }
  
  // 'C' key to clear intercepts
  if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
    e.preventDefault();
    const warRoom = new WarRoomController();
    warRoom.clearIntercepts();
  }
  
  // Arrow keys for carousel
  if (e.key === 'ArrowLeft') {
    const currentDot = document.querySelector('.carousel-dot.active');
    if (currentDot) {
      const currentIndex = parseInt(currentDot.dataset.slide);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : 2;
      document.querySelector(`.carousel-dot[data-slide="${newIndex}"]`).click();
    }
  }
  
  if (e.key === 'ArrowRight') {
    const currentDot = document.querySelector('.carousel-dot.active');
    if (currentDot) {
      const currentIndex = parseInt(currentDot.dataset.slide);
      const newIndex = currentIndex < 2 ? currentIndex + 1 : 0;
      document.querySelector(`.carousel-dot[data-slide="${newIndex}"]`).click();
    }
  }
});
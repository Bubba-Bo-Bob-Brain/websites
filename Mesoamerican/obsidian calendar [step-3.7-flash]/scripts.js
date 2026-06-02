// ============================================
// TONALPOHUALLI — Ceremonial Calendar Engine
// ============================================

// --- Configuration & State ---
const CONFIG = {
  daySigns: [
    'Cipactli', 'Ehecatl', 'Calli', 'Cuetzpalin', 'Coatl',
    'Miquiztli', 'Mazatl', 'Tochtli', 'Atl', 'Itzquintli',
    'Ozomahtli', 'Malinalli', 'Acatl', 'Ocelotl', 'Cuauhtli',
    'Cozcacuauhtli', 'Ollin', 'Tecpatl', 'Quiahuitl', 'Xochitl'
  ],
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  directions: ['East', 'South', 'West', 'North'],
  venusPhases: ['morning-star', 'superior', 'evening-star', 'inferior'],
  tonalYearLength: 260, // 20 signs × 13 numbers
  solarYearLength: 365,
  venusCycleLength: 584
};

const state = {
  rotations: {
    outer: 0,    // Day signs ring
    middle: 0,   // Numbers ring
    inner: 0,    // Directions ring
    venus: 0     // Venus cycle ring
  },
  currentDate: null,
  isDragging: false,
  dragStart: 0,
  dragRing: null
};

// --- DOM Elements ---
const elements = {
  countdown: {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    mins: document.getElementById('countdown-mins'),
    secs: document.getElementById('countdown-secs'),
    target: document.getElementById('countdown-target')
  },
  wheel: {
    outer: document.getElementById('ring-outer'),
    middle: document.getElementById('ring-middle'),
    inner: document.getElementById('ring-inner'),
    venus: document.getElementById('ring-venus'),
    center: document.querySelector('.wheel-center')
  },
  display: {
    tonal: document.getElementById('current-tonal-date'),
    solar: document.getElementById('current-solar-date')
  },
  tooltip: {
    el: document.getElementById('glyph-tooltip'),
    icon: document.getElementById('tooltip-icon'),
    name: document.getElementById('tooltip-name'),
    translation: document.getElementById('tooltip-translation')
  },
  legend: {
    toggle: document.getElementById('legend-toggle'),
    panel: document.getElementById('legend-panel')
  }
};

// --- Calendar Calculations ---
class Tonalpohualli {
  static getCurrentDate() {
    const now = new Date();
    // Calculate days since a known reference date (e.g., January 1, 2020 was 4 Cipactli)
    // Reference: January 1, 2020 = 4 Cipactli
    const referenceDate = new Date(2020, 0, 1);
    const referenceDaySign = 4; // Cipactli (index 0 + 4)
    const referenceNumber = 4;
    
    const diffTime = now - referenceDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate current position in 260-day cycle
    const cyclePosition = ((diffDays % CONFIG.tonalYearLength) + CONFIG.tonalYearLength) % CONFIG.tonalYearLength;
    
    const daySignIndex = (referenceDaySign + cyclePosition) % 20;
    const number = ((referenceNumber + cyclePosition - 1) % 13) + 1;
    
    return {
      daySign: CONFIG.daySigns[daySignIndex],
      number: number,
      fullDate: `${number} ${CONFIG.daySigns[daySignIndex]}`,
      cyclePosition: cyclePosition
    };
  }

  static getSolarDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  }

  static getDaysUntilNewFire() {
    // New Fire Ceremony target: December 2025 (approximate next ceremony date)
    const now = new Date();
    const target = new Date(2025, 11, 1); // December 2025
    const diffTime = target - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

// --- Countdown Timer ---
function updateCountdown() {
  const days = Tonalpohualli.getDaysUntilNewFire();
  const now = new Date();
  
  // Set target date for countdown
  const target = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  elements.countdown.target.textContent = `Ceremony of the New Fire — ${target.getFullYear()}`;
  
  // Calculate time components
  const diffTime = target - now;
  const totalSeconds = Math.floor(diffTime / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  
  const secs = totalSeconds % 60;
  const mins = totalMinutes % 60;
  const hours = totalHours % 24;
  const daysRemaining = Math.floor(totalHours / 24);
  
  // Update display with leading zeros
  elements.countdown.days.textContent = String(daysRemaining).padStart(2, '0');
  elements.countdown.hours.textContent = String(hours).padStart(2, '0');
  elements.countdown.mins.textContent = String(mins).padStart(2, '0');
  elements.countdown.secs.textContent = String(secs).padStart(2, '0');
  
  // Add urgent class if less than 30 days
  if (daysRemaining < 30) {
    elements.countdown.el.classList.add('urgent');
  }
}

// --- Wheel Rotation ---
function rotateRing(ringName, degrees) {
  const ring = elements.wheel[ringName];
  if (!ring) return;
  
  state.rotations[ringName] = (state.rotations[ringName] + degrees) % 360;
  ring.style.transform = `rotate(${state.rotations[ringName]}deg)`;
  
  // Add haptic-like feedback animation
  ring.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  // Play subtle sound effect (optional, browser dependent)
  playRotationSound();
  
  // Update current date display based on rotation
  updateCurrentDateDisplay();
}

function resetWheel() {
  Object.keys(state.rotations).forEach(ring => {
    state.rotations[ring] = 0;
    elements.wheel[ring].style.transform = 'rotate(0deg)';
  });
  
  // Animate reset
  setTimeout(() => {
    updateCurrentDateDisplay();
  }, 1200);
}

function updateCurrentDateDisplay() {
  const tonal = Tonalpohualli.getCurrentDate();
  state.currentDate = tonal;
  elements.display.tonal.textContent = tonal.fullDate;
  elements.display.solar.textContent = Tonalpohualli.getSolarDate();
  
  // Highlight corresponding markers
  highlightCurrentMarkers(tonal);
}

function highlightCurrentMarkers(tonal) {
  // Remove previous highlights
  document.querySelectorAll('.marker').forEach(m => {
    m.classList.remove('active');
  });
  
  // Highlight current day sign
  const daySignMarkers = document.querySelectorAll('.marker:not(.marker-number):not(.marker-direction):not(.marker-venus)');
  // This is simplified - in a full implementation we'd map the rotation to the correct marker
}

// --- Tooltip System ---
function initTooltip() {
  const glyphs = document.querySelectorAll('.glyph');
  
  glyphs.forEach(glyph => {
    glyph.addEventListener('mouseenter', (e) => {
      const name = glyph.dataset.glyphName;
      const translation = glyph.dataset.translation;
      
      if (name && translation) {
        showTooltip(e, glyph, name, translation);
      }
    });
    
    glyph.addEventListener('mousemove', (e) => {
      positionTooltip(e);
    });
    
    glyph.addEventListener('mouseleave', () => {
      hideTooltip();
    });
    
    // Keyboard accessibility
    glyph.setAttribute('tabindex', '0');
    glyph.addEventListener('focus', (e) => {
      const name = glyph.dataset.glyphName;
      const translation = glyph.dataset.translation;
      if (name && translation) {
        showTooltip(e, glyph, name, translation);
      }
    });
    
    glyph.addEventListener('blur', () => {
      hideTooltip();
    });
  });
}

function showTooltip(e, element, name, translation) {
  elements.tooltip.icon.textContent = element.textContent;
  elements.tooltip.name.textContent = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
  elements.tooltip.translation.textContent = translation;
  
  elements.tooltip.el.classList.add('visible');
  elements.tooltip.el.setAttribute('aria-hidden', 'false');
  
  positionTooltip(e);
}

function positionTooltip(e) {
  const x = e.clientX || e.pageX;
  const y = e.clientY || e.pageY;
  
  const tooltipRect = elements.tooltip.el.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  let left = x + 15;
  let top = y + 15;
  
  // Prevent overflow
  if (left + tooltipRect.width > windowWidth - 20) {
    left = x - tooltipRect.width - 15;
  }
  if (top + tooltipRect.height > windowHeight - 20) {
    top = y - tooltipRect.height - 15;
  }
  
  elements.tooltip.el.style.left = `${left}px`;
  elements.tooltip.el.style.top = `${top}px`;
}

function hideTooltip() {
  elements.tooltip.el.classList.remove('visible');
  elements.tooltip.el.setAttribute('aria-hidden', 'true');
}

// --- Legend Toggle ---
function initLegend() {
  elements.legend.toggle.addEventListener('click', () => {
    const isExpanded = elements.legend.toggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    elements.legend.toggle.setAttribute('aria-expanded', newState);
    elements.legend.panel.setAttribute('aria-hidden', !newState);
    elements.legend.panel.classList.toggle('open', newState);
  });
}

// --- Wheel Controls ---
function initWheelControls() {
  const buttons = document.querySelectorAll('.wheel-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const ring = btn.dataset.ring;
      
      if (ring === 'reset') {
        resetWheel();
      } else {
        // Rotate ring by one segment (18 degrees for 20 signs, 27.69 for 13 numbers)
        let degrees = 18;
        if (ring === 'middle') degrees = 27.69;
        if (ring === 'inner') degrees = 90;
        if (ring === 'venus') degrees = 45;
        
        rotateRing(ring, degrees);
      }
    });
  });
  
  // Mouse wheel rotation for the center wheel
  const wheelFrame = document.querySelector('.wheel-frame');
  if (wheelFrame) {
    wheelFrame.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 15 : -15;
      // Rotate all rings together
      Object.keys(state.rotations).forEach(ring => {
        rotateRing(ring, delta);
      });
    }, { passive: false });
  }
}

// --- Drag to Rotate ---
function initDragRotation() {
  const wheelFrame = document.querySelector('.wheel-frame');
  if (!wheelFrame) return;
  
  wheelFrame.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.dragStart = e.clientX;
    state.dragRing = 'all'; // Rotate all rings together when dragging
    wheelFrame.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    
    const deltaX = e.clientX - state.dragStart;
    const sensitivity = 0.5;
    
    if (Math.abs(deltaX) > 5) {
      const rotation = deltaX * sensitivity;
      Object.keys(state.rotations).forEach(ring => {
        rotateRing(ring, rotation);
      });
      state.dragStart = e.clientX;
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (state.isDragging) {
      state.isDragging = false;
      wheelFrame.style.cursor = 'grab';
    }
  });
  
  // Touch support
  wheelFrame.addEventListener('touchstart', (e) => {
    state.isDragging = true;
    state.dragStart = e.touches[0].clientX;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!state.isDragging) return;
    const deltaX = e.touches[0].clientX - state.dragStart;
    const sensitivity = 0.5;
    
    if (Math.abs(deltaX) > 5) {
      const rotation = deltaX * sensitivity;
      Object.keys(state.rotations).forEach(ring => {
        rotateRing(ring, rotation);
      });
      state.dragStart = e.touches[0].clientX;
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    state.isDragging = false;
  });
}

// --- Sound Effects (Subtle) ---
function playRotationSound() {
  // Create a subtle click sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Audio not supported or blocked
  }
}

// --- Ritual Card Interactions ---
function initRitualCards() {
  const cards = document.querySelectorAll('.ritual-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active state from all cards
      cards.forEach(c => c.classList.remove('active'));
      // Add active state to clicked card
      card.classList.add('active');
      
      // Highlight corresponding glyph in tooltip
      const glyph = card.querySelector('.glyph');
      if (glyph) {
        const name = glyph.dataset.glyphName;
        const translation = glyph.dataset.translation;
        if (name && translation) {
          showTooltip(
            { clientX: card.getBoundingClientRect().right, clientY: card.getBoundingClientRect().top },
            glyph,
            name,
            translation
          );
          setTimeout(hideTooltip, 3000);
        }
      }
    });
  });
}

// --- Deity Card Interactions ---
function initDeityCards() {
  const cards = document.querySelectorAll('.deity-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      // Pulse the deity symbol
      const symbol = card.querySelector('.deity-symbol');
      if (symbol) {
        symbol.style.animation = 'none';
        symbol.offsetHeight; // Trigger reflow
        symbol.style.animation = 'pulse-blood 1s ease-in-out';
      }
    });
  });
}

// --- Astronomical Event Countdowns ---
function initAstronomicalEvents() {
  const events = [
    { id: 'eclipse', date: new Date(2025, 7, 12) }, // August 12, 2025
    { id: 'solstice', date: new Date(2025, 5, 21) }, // June 21, 2025
    { id: 'venus-transit', date: new Date(2025, 10, 4) }, // November 4, 2025
    { id: 'equinox', date: new Date(2025, 2, 20) }, // March 20, 2025
    { id: 'meteor', date: new Date(2025, 4, 5) } // May 5, 2025
  ];
  
  const now = new Date();
  
  events.forEach(event => {
    const card = document.querySelector(`[data-event="${event.id}"]`);
    if (!card) return;
    
    const diffTime = event.date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays < 365) {
      const dateEl = card.querySelector('.astro-date');
      if (dateEl) {
        dateEl.textContent = `${event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${diffDays} days)`;
      }
      
      // Highlight upcoming events
      if (diffDays < 60) {
        card.style.borderColor = 'rgba(212, 175, 55, 0.6)';
        card.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
      }
    }
  });
}

// --- Tribute Season Highlight ---
function initTributeSeasons() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  
  // Map months to tribute seasons (simplified)
  const tributeMonths = {
    'cotton': 1,  // February
    'cacao': 9,   // October
    'jade': 5,    // June
    'feathers': 4, // May
    'obsidian': 7, // August
    'maize': 6    // July
  };
  
  Object.entries(tributeMonths).forEach(([tribute, month]) => {
    const item = document.querySelector(`[data-tribute="${tribute}"]`);
    if (!item) return;
    
    // Highlight if current month is within 1 month of tribute season
    if (Math.abs(currentMonth - month) <= 1 || Math.abs(currentMonth - month) >= 11) {
      item.style.borderColor = 'rgba(0, 168, 107, 0.4)';
      item.style.background = 'rgba(0, 168, 107, 0.1)';
    }
  });
}

// --- Serpent Border Animation Enhancement ---
function enhanceSerpentAnimation() {
  const serpents = document.querySelectorAll('.feathered-serpent-border');
  
  serpents.forEach(serpent => {
    // Add subtle parallax on mouse move
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      
      serpent.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// --- Initialization ---
function init() {
  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Initialize current date display
  updateCurrentDateDisplay();
  
  // Initialize all modules
  initTooltip();
  initLegend();
  initWheelControls();
  initDragRotation();
  initRitualCards();
  initDeityCards();
  initAstronomicalEvents();
  initTributeSeasons();
  enhanceSerpentAnimation();
  
  // Add loaded class for entrance animations
  document.body.classList.add('loaded');
  
  // Log initialization
  console.log('%c𓂀 Tonalpohualli Initialized %c| %cCeremonial Calendar of the Ancients',
    'color: #d4af37; font-size: 1.2em;',
    '',
    'color: #a89f8e; font-style: italic;');
  console.log('%cCurrent Date: %c' + Tonalpohualli.getCurrentDate().fullDate,
    'color: #00a86b;',
    'color: #e3dac9; font-weight: bold;');
}

// --- Start Application ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- Service Worker Registration for PWA (Optional) ---
if ('serviceWorker' in navigator) {
  // Could register service worker for offline functionality
  // navigator.serviceWorker.register('/sw.js');
}

// --- Export for module usage ---
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Tonalpohualli, CONFIG, state };
}
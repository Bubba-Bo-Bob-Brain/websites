/**
 * HŌKŪLEʻA - Celestial Wayfinding Chart
 * Interactive Navigation Scripts
 */

// ============================================
// Configuration & State
// ============================================

const config = {
  starCount: 200,
  trailLength: 20,
  trailDelay: 50,
  rotationSpeed: 0.02,
  swellSpeed: 0.001,
  bioIntensity: 0.6
};

const state = {
  mouseX: 0,
  mouseY: 0,
  isRotating: false,
  showCurrents: false,
  showConstellations: false,
  trailQueue: [],
  activeIsland: null,
  domeRotation: 0
};

// ============================================
// DOM Elements
// ============================================

const elements = {
  // Loading
  loadingScreen: document.getElementById('loading-screen'),
  
  // Layers
  starField: document.getElementById('star-field'),
  celestialDome: document.getElementById('celestial-dome'),
  bioLayer: document.getElementById('bio-layer'),
  cursorTrail: document.getElementById('cursor-trail'),
  
  // Chart elements
  chart: document.getElementById('wayfinding-chart'),
  starPaths: document.querySelectorAll('.star-line'),
  islandGroups: document.querySelectorAll('.island-group'),
  navStars: document.querySelectorAll('.nav-star'),
  constellations: document.querySelectorAll('.constellation'),
  
  // Controls
  btnRotate: document.getElementById('btn-rotate'),
  btnCurrents: document.getElementById('btn-currents'),
  btnConstellations: document.getElementById('btn-constellations'),
  btnReset: document.getElementById('btn-reset'),
  
  // UI
  infoPanel: document.getElementById('info-panel'),
  infoTitle: document.getElementById('info-title'),
  infoContent: document.getElementById('info-content'),
  compassRose: document.getElementById('compass-rose'),
  latDisplay: document.getElementById('lat-display'),
  lonDisplay: document.getElementById('lon-display'),
  
  // Markers
  markers: document.querySelectorAll('.nav-marker')
};

// ============================================
// Initialization
// ============================================

function init() {
  // Hide loading screen after assets load
  window.addEventListener('load', () => {
    setTimeout(() => {
      elements.loadingScreen.classList.add('hidden');
      startAmbientAnimations();
    }, 1500);
  });

  // Generate star field
  generateStarField();
  
  // Initialize event listeners
  setupEventListeners();
  
  // Start animation loops
  requestAnimationFrame(animate);
  
  console.log('Hōkūleʻa navigation system initialized');
}

// ============================================
// Star Field Generation
// ============================================

function generateStarField() {
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < config.starCount; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2;
    
    star.className = 'generated-star';
    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: ${Math.random() * 0.8 + 0.2};
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
      animation: twinkle ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    fragment.appendChild(star);
  }
  
  // Add shooting stars periodically
  createShootingStar();
  setInterval(createShootingStar, 8000);
  
  elements.starField.appendChild(fragment);
}

function createShootingStar() {
  const shootingStar = document.createElement('div');
  const startY = Math.random() * 50;
  const duration = Math.random() * 2 + 1;
  
  shootingStar.style.cssText = `
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, white, transparent);
    left: -100px;
    top: ${startY}%;
    transform: rotate(-45deg);
    animation: shoot ${duration}s linear forwards;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shoot {
      to {
        left: 110%;
        top: ${startY + 20}%;
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
  elements.starField.appendChild(shootingStar);
  
  setTimeout(() => {
    shootingStar.remove();
    style.remove();
  }, duration * 1000);
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
  // Mouse movement tracking
  document.addEventListener('mousemove', handleMouseMove);
  
  // Control buttons
  elements.btnRotate.addEventListener('click', toggleRotation);
  elements.btnCurrents.addEventListener('click', toggleCurrents);
  elements.btnConstellations.addEventListener('click', toggleConstellations);
  elements.btnReset.addEventListener('click', resetView);
  
  // Island interactions
  elements.islandGroups.forEach(island => {
    island.addEventListener('mouseenter', (e) => showIslandInfo(e, island));
    island.addEventListener('mouseleave', hideIslandInfo);
    island.addEventListener('click', (e) => highlightIsland(island));
  });
  
  // Navigation stars
  elements.navStars.forEach(star => {
    star.addEventListener('mouseenter', (e) => highlightStarPath(e.target));
    star.addEventListener('mouseleave', resetStarPaths);
  });
  
  // Constellation interactions
  elements.constellations.forEach(constellation => {
    constellation.addEventListener('click', (e) => activateConstellation(constellation));
  });
  
  // Markers
  elements.markers.forEach(marker => {
    marker.addEventListener('click', () => {
      const direction = marker.dataset.direction;
      flashDirection(direction);
    });
  });
  
  // Window resize
  window.addEventListener('resize', handleResize);
  
  // Keyboard controls
  document.addEventListener('keydown', handleKeyPress);
}

// ============================================
// Mouse & Movement Handlers
// ============================================

function handleMouseMove(e) {
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;
  
  // Update coordinates display
  updateCoordinates(e);
  
  // Create bioluminescent trail
  addTrailParticle(e.clientX, e.clientY);
  
  // Parallax effect on celestial dome
  updateDomeParallax(e);
  
  // Update compass
  updateCompass(e);
}

function updateCoordinates(e) {
  // Simulate navigation coordinates based on mouse position
  const lat = ((e.clientY / window.innerHeight) * 60 - 30).toFixed(2);
  const lon = ((e.clientX / window.innerWidth) * 180 - 90).toFixed(2);
  
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  elements.latDisplay.textContent = `${Math.abs(lat).toFixed(2)}° ${latDir}`;
  elements.lonDisplay.textContent = `${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}

function addTrailParticle(x, y) {
  const now = Date.now();
  
  // Throttle trail creation
  if (state.trailQueue.length > 0 && now - state.trailQueue[0].time < config.trailDelay) {
    return;
  }
  
  const particle = document.createElement('div');
  particle.className = 'trail-particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // Randomize slightly for organic feel
  const offsetX = (Math.random() - 0.5) * 4;
  const offsetY = (Math.random() - 0.5) * 4;
  particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  
  elements.cursorTrail.appendChild(particle);
  
  // Add to queue with timestamp
  state.trailQueue.push({ element: particle, time: now });
  
  // Remove old particles
  if (state.trailQueue.length > config.trailLength) {
    const old = state.trailQueue.shift();
    old.element.remove();
  }
  
  // Cleanup after animation
  setTimeout(() => {
    particle.remove();
  }, 1000);
}

function updateDomeParallax(e) {
  if (state.isRotating) return;
  
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
  
  const rotateX = yPercent * 5;
  const rotateY = xPercent * 5;
  
  elements.celestialDome.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;
}

function updateCompass(e) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
  
  elements.compassRose.style.transform = `rotate(${angle}deg)`;
}

// ============================================
// Interactive Features
// ============================================

function toggleRotation() {
  state.isRotating = !state.isRotating;
  elements.btnRotate.classList.toggle('active');
  
  if (state.isRotating) {
    elements.celestialDome.classList.add('rotating');
    elements.celestialDome.style.transform = '';
  } else {
    elements.celestialDome.classList.remove('rotating');
  }
}

function toggleCurrents() {
  state.showCurrents = !state.showCurrents;
  elements.btnCurrents.classList.toggle('active');
  document.body.classList.toggle('currents-active');
  
  // Visual feedback
  if (state.showCurrents) {
    elements.bioLayer.style.opacity = '0.6';
  } else {
    elements.bioLayer.style.opacity = '0';
  }
}

function toggleConstellations() {
  state.showConstellations = !state.showConstellations;
  elements.btnConstellations.classList.toggle('active');
  document.body.classList.toggle('constellations-active');
  
  // Highlight all constellation lines
  elements.constellations.forEach(constellation => {
    const lines = constellation.querySelectorAll('.constellation-line');
    lines.forEach(line => {
      line.style.stroke = state.showConstellations ? 'var(--star-gold)' : '';
      line.style.opacity = state.showConstellations ? '0.8' : '0.3';
    });
  });
}

function resetView() {
  // Reset all toggles
  state.isRotating = false;
  state.showCurrents = false;
  state.showConstellations = false;
  
  elements.btnRotate.classList.remove('active');
  elements.btnCurrents.classList.remove('active');
  elements.btnConstellations.classList.remove('active');
  
  elements.celestialDome.classList.remove('rotating');
  document.body.classList.remove('currents-active', 'constellations-active');
  elements.bioLayer.style.opacity = '0';
  
  // Reset transforms
  elements.celestialDome.style.transform = '';
  
  // Hide info panel
  hideIslandInfo();
}

function showIslandInfo(e, island) {
  const name = island.dataset.name;
  const info = island.dataset.info;
  
  elements.infoTitle.textContent = name;
  elements.infoContent.innerHTML = `<p>${info}</p>`;
  elements.infoPanel.classList.remove('hidden');
  
  // Play subtle animation on island
  island.style.transform = 'scale(1.3)';
  setTimeout(() => {
    island.style.transform = '';
  }, 300);
}

function hideIslandInfo() {
  elements.infoPanel.classList.add('hidden');
}

function highlightIsland(island) {
  // Create ripple effect
  const rect = island.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    width: 50px;
    height: 50px;
    border: 2px solid var(--bio-teal);
    border-radius: 50%;
    left: ${rect.left + rect.width/2 - 25}px;
    top: ${rect.top + rect.height/2 - 25}px;
    animation: ripple-expand 1s forwards;
    pointer-events: none;
    z-index: 50;
  `;
  
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
}

function highlightStarPath(star) {
  const starName = star.dataset.name;
  
  // Find corresponding path
  const pathId = `path-${star.id.replace('star-', '')}`;
  const path = document.getElementById(pathId);
  
  if (path) {
    path.style.stroke = 'var(--star-gold)';
    path.style.strokeWidth = '3';
    path.style.opacity = '1';
    path.style.filter = 'url(#starGlow)';
  }
  
  // Show info
  elements.infoTitle.textContent = starName;
  elements.infoContent.innerHTML = `<p>Navigation star used by ancient Polynesian wayfinders. Rises ${Math.floor(Math.random() * 60 + 20)}° above horizon at latitude.</p>`;
  elements.infoPanel.classList.remove('hidden');
}

function resetStarPaths() {
  elements.starPaths.forEach(path => {
    path.style.stroke = '';
    path.style.strokeWidth = '';
    path.style.opacity = '';
    path.style.filter = '';
  });
  hideIslandInfo();
}

function activateConstellation(constellation) {
  const stars = constellation.querySelectorAll('.star-point');
  
  // Animate connection sequence
  stars.forEach((star, index) => {
    setTimeout(() => {
      star.style.fill = '#fff';
      star.style.r = '6';
      star.style.filter = 'url(#starGlow)';
      
      setTimeout(() => {
        star.style.fill = '';
        star.style.r = '';
        star.style.filter = '';
      }, 500);
    }, index * 200);
  });
  
  // Flash bioluminescent layer
  elements.bioLayer.style.opacity = '0.8';
  setTimeout(() => {
    elements.bioLayer.style.opacity = state.showCurrents ? '0.6' : '0';
  }, 300);
}

function flashDirection(direction) {
  const directionNames = { N: 'North', E: 'East', S: 'South', W: 'West' };
  elements.infoTitle.textContent = directionNames[direction];
  elements.infoContent.innerHTML = `<p>Cardinal direction marker. Ancient navigators used the stars, waves, and wind to maintain course toward ${directionNames[direction]}.</p>`;
  elements.infoPanel.classList.remove('hidden');
}

// ============================================
// Animation Loop
// ============================================

function animate() {
  // Continuous subtle animations
  const time = Date.now() * 0.001;
  
  // Animate star field subtle movement
  if (!state.isRotating && elements.starField) {
    const offsetX = Math.sin(time * 0.1) * 5;
    const offsetY = Math.cos(time * 0.1) * 5;
    elements.starField.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  
  // Animate ocean swells if currents active
  if (state.showCurrents) {
    animateSwells(time);
  }
  
  requestAnimationFrame(animate);
}

function animateSwells(time) {
  const swells = document.querySelectorAll('.swell-line');
  swells.forEach((swell, index) => {
    const phase = time * config.swellSpeed + (index * 0.5);
    const yOffset = Math.sin(phase) * 10;
    swell.style.transform = `translateY(${yOffset}px)`;
  });
}

function startAmbientAnimations() {
  // Start any continuous ambient effects
  console.log('Ambient animations started');
}

// ============================================
// Keyboard Controls
// ============================================

function handleKeyPress(e) {
  switch(e.key) {
    case 'r':
    case 'R':
      toggleRotation();
      break;
    case 'c':
    case 'C':
      toggleCurrents();
      break;
    case 's':
    case 'S':
      toggleConstellations();
      break;
    case 'Escape':
      resetView();
      break;
    case ' ':
      e.preventDefault();
      // Space to toggle info panel
      if (elements.infoPanel.classList.contains('hidden')) {
        elements.infoTitle.textContent = 'Hōkūleʻa';
        elements.infoContent.innerHTML = '<p>Hover over stars, islands, and paths to explore. Use R for rotation, C for currents, S for stars.</p>';
        elements.infoPanel.classList.remove('hidden');
      } else {
        hideIslandInfo();
      }
      break;
  }
}

function handleResize() {
  // Recalculate positions if needed
  // Debounce this in production
}

// ============================================
// Utility Functions
// ============================================

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential module use
window.WayfindingChart = {
  state,
  toggleRotation,
  toggleCurrents,
  toggleConstellations,
  resetView
};
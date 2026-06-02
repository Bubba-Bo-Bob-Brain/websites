// ========== GLOBAL STATE ==========
const state = {
  currentEra: 'classical',
  activeRegion: null,
  activeMyths: new Set(),
  showTradeRoutes: true,
  showMyths: true,
};

// ========== DOM ELEMENTS ==========
const elements = {
  // Era Slider
  eraSlider: document.getElementById('era-slider'),
  eraName: document.getElementById('current-era'),
  htmlElement: document.documentElement,

  // Regions
  regions: document.querySelectorAll('.region'),

  // Trade Routes
  tradeRoutes: document.querySelectorAll('.trade-route'),

  // Myth Annotations
  mythAnnotations: document.querySelectorAll('.myth-annotation'),

  // Legend Toggles
  tradeRoutesToggle: document.getElementById('trade-routes-toggle'),
  mythsToggle: document.getElementById('myths-toggle'),
};

// ========== ERA SLIDER LOGIC ==========
const eras = {
  1: { name: 'Dawn Age', theme: 'dawn' },
  2: { name: 'Classical Age', theme: 'classical' },
  3: { name: 'Empire Age', theme: 'empire' },
  4: { name: 'Decline Age', theme: 'decline' },
};

function updateEra(eraValue) {
  const era = eras[eraValue];
  state.currentEra = era.theme;

  // Update UI
  elements.eraName.textContent = era.name;
  elements.htmlElement.setAttribute('data-era', era.theme);

  // Update regions based on era
  updateRegionsForEra();
}

function updateRegionsForEra() {
  // In a real project, you'd have data defining region colors/borders per era.
  // For demo purposes, we'll just tweak opacity to simulate changes.
  elements.regions.forEach(region => {
    const baseOpacity = state.currentEra === 'decline' ? 0.5 : 0.7;
    region.style.fillOpacity = baseOpacity;

    // Example: Empire Age highlights Valmora
    if (state.currentEra === 'empire' && region.id === 'region-valmora') {
      region.style.fill = 'var(--gold)';
      region.style.stroke = 'var(--gold-dark)';
    } else {
      region.style.fill = 'rgba(74, 74, 74, 0.3)';
      region.style.stroke = 'rgba(255, 255, 255, 0.4)';
    }
  });
}

// ========== REGION INTERACTIONS ==========
function setupRegionInteractions() {
  elements.regions.forEach(region => {
    region.addEventListener('click', (e) => {
      const regionId = e.target.id.replace('region-', '');
      toggleRegion(regionId);
    });

    // Gold leaf shimmer on hover
    region.addEventListener('mouseenter', () => {
      region.style.filter = 'drop-shadow(0 0 4px var(--gold))';
    });
    region.addEventListener('mouseleave', () => {
      region.style.filter = 'none';
    });
  });
}

function toggleRegion(regionId) {
  // Deactivate previous region
  if (state.activeRegion) {
    elements.regions.forEach(r => {
      if (r.id === `region-${state.activeRegion}`) {
        r.classList.remove('active');
      }
    });
    // Hide associated myth
    const activeMyth = document.querySelector(`.myth-annotation[data-myth="${state.activeRegion}"]`);
    if (activeMyth) activeMyth.classList.remove('active');
  }

  // Activate new region
  if (state.activeRegion !== regionId) {
    state.activeRegion = regionId;
    const regionElement = document.getElementById(`region-${regionId}`);
    regionElement.classList.add('active');

    // Show associated myth
    const myth = document.querySelector(`.myth-annotation[data-myth="${regionId}"]`);
    if (myth) {
      myth.classList.add('active');
      state.activeMyths.add(regionId);
    }

    // Play sound (optional)
    // const audio = new Audio('path/to/gold-shimmer.mp3');
    // audio.play();
  } else {
    state.activeRegion = null;
  }
}

// ========== TRADE ROUTE ANIMATIONS ==========
function setupTradeRoutes() {
  // Create caravans/ships as SVG elements
  elements.tradeRoutes.forEach(route => {
    const routeId = route.id;
    const routeLength = route.getTotalLength();

    // Create a caravan icon (SVG circle or custom path)
    const caravan = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    caravan.setAttribute('r', '6');
    caravan.setAttribute('fill', 'var(--gold-dark)');
    caravan.setAttribute('class', 'caravan');
    route.parentNode.appendChild(caravan);

    // Animate caravan along the route
    animateCaravan(caravan, route, routeLength);
  });
}

function animateCaravan(caravan, path, pathLength) {
  let progress = 0;
  const duration = 20; // seconds

  function moveCaravan() {
    progress = (progress + 0.5) % 100;
    const point = path.getPointAtLength(progress / 100 * pathLength);
    caravan.setAttribute('cx', point.x);
    caravan.setAttribute('cy', point.y);

    // Continue animation
    if (state.showTradeRoutes) {
      requestAnimationFrame(moveCaravan);
    }
  }

  moveCaravan();
}

// ========== MYTH ANNOTATIONS ==========
function setupMythAnnotations() {
  // Add subtle dust particles on reveal
  elements.mythAnnotations.forEach(annotation => {
    annotation.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity' && annotation.classList.contains('active')) {
        createDustParticles(annotation);
      }
    });
  });
}

function createDustParticles(annotation) {
  const rect = annotation.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.classList.add('dust-particle');
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--delay', `${i * 0.2}s`);
    document.body.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 2000);
  }
}

// ========== LEGEND TOGGLES ==========
function setupLegendToggles() {
  elements.tradeRoutesToggle.addEventListener('change', (e) => {
    state.showTradeRoutes = e.target.checked;
    elements.tradeRoutes.forEach(route => {
      route.style.opacity = e.target.checked ? 0.7 : 0;
    });
  });

  elements.mythsToggle.addEventListener('change', (e) => {
    state.showMyths = e.target.checked;
    elements.mythAnnotations.forEach(annotation => {
      annotation.style.opacity = e.target.checked && state.activeMyths.has(annotation.dataset.myth) ? 1 : 0;
    });
  });
}

// ========== INITIALIZATION ==========
function init() {
  // Era Slider
  elements.eraSlider.addEventListener('input', (e) => {
    updateEra(e.target.value);
  });
  updateEra(elements.eraSlider.value);

  // Region Interactions
  setupRegionInteractions();

  // Trade Routes
  setupTradeRoutes();

  // Myth Annotations
  setupMythAnnotations();

  // Legend Toggles
  setupLegendToggles();

  // Load dust particle styles dynamically
  loadDustStyles();
}

// ========== DUST PARTICLE STYLES ==========
function loadDustStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .dust-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(212, 175, 55, 0.6);
      border-radius: 50%;
      pointer-events: none;
      animation: floatDust 2s ease-out var(--delay, 0s) forwards;
    }
    @keyframes floatDust {
      0% { transform: translate(0, 0); opacity: 1; }
      100% { transform: translate(var(--dx, 10px), var(--dy, -20px)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ========== START ==========
init();
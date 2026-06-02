// ===== DOM Elements =====
const starField = document.querySelector('.star-field');
const stars = document.querySelectorAll('.star');
const constellationLines = document.querySelectorAll('.constellation-line');
const bioluminescentTrail = document.querySelector('.bioluminescent-trail');
const oceanCurrents = document.querySelectorAll('.ocean-current');
const tikiCompass = document.querySelector('.tiki-compass');
const btnToggleConstellations = document.querySelector('.btn-toggle-constellations');
const btnReset = document.querySelector('.btn-reset');
const wayfindingChart = document.querySelector('.wayfinding-chart');

// ===== State =====
let isConstellationMode = false;
let activeConstellation = null;
let mouseX = 0;
let mouseY = 0;
let trailPosition = { x: 0, y: 0 };
let trailSegments = [];
const maxTrailLength = 20;

// ===== Constellation Data =====
const constellations = {
  'maui-hook': [
    { x: 15, y: 25 },
    { x: 20, y: 20 },
    { x: 25, y: 15 },
    { x: 30, y: 20 }
  ],
  'te-potiki': [
    { x: 70, y: 15 },
    { x: 75, y: 20 },
    { x: 80, y: 15 }
  ],
  'te-iki': [
    { x: 40, y: 60 },
    { x: 45, y: 55 },
    { x: 50, y: 60 },
    { x: 55, y: 55 }
  ],
  'whale': [
    { x: 85, y: 70 },
    { x: 80, y: 75 },
    { x: 75, y: 70 },
    { x: 70, y: 75 },
    { x: 65, y: 70 }
  ]
};

// ===== Initialize =====
function init() {
  placeStarsRandomly();
  setupEventListeners();
  updateConstellationLines();
  animateOceanCurrents();
  startTrailAnimation();
}

// ===== Place Stars Randomly =====
function placeStarsRandomly() {
  stars.forEach(star => {
    const constellation = star.dataset.constellation;
    if (constellations[constellation]) {
      const points = constellations[constellation];
      const randomPoint = points[Math.floor(Math.random() * points.length)];
      star.style.left = `${randomPoint.x}%`;
      star.style.top = `${randomPoint.y}%`;
    } else {
      // Random placement for non-constellation stars
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
    }
  });
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Mouse move for parallax and trail
  wayfindingChart.addEventListener('mousemove', (e) => {
    const rect = wayfindingChart.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Update star positions (parallax)
    stars.forEach(star => {
      const speed = Math.random() * 0.5 + 0.1;
      const xOffset = (mouseX - rect.width / 2) * speed * 0.001;
      const yOffset = (mouseY - rect.height / 2) * speed * 0.001;
      star.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });

    // Update trail position
    trailPosition = { x: mouseX, y: mouseY };
    updateTrail();

    // Rotate compass slightly based on cursor
    const angle = Math.atan2(mouseY - rect.height / 2, mouseX - rect.width / 2) * (180 / Math.PI);
    tikiCompass.style.transform = `translate(-50%, -50%) rotate(${angle * 0.1}deg)`;
  });

  // Click to toggle constellations
  starField.addEventListener('click', (e) => {
    if (!isConstellationMode) return;

    const star = e.target.closest('.star');
    if (!star) return;

    const constellation = star.dataset.constellation;
    if (activeConstellation === constellation) {
      activeConstellation = null;
      updateConstellationLines();
    } else {
      activeConstellation = constellation;
      updateConstellationLines();
    }
  });

  // Toggle constellation mode
  btnToggleConstellations.addEventListener('click', () => {
    isConstellationMode = !isConstellationMode;
    btnToggleConstellations.textContent = isConstellationMode ? 'Hide Star Paths' : 'Show Star Paths';
    if (!isConstellationMode) {
      activeConstellation = null;
      updateConstellationLines();
    }
  });

  // Reset view
  btnReset.addEventListener('click', () => {
    activeConstellation = null;
    isConstellationMode = false;
    btnToggleConstellations.textContent = 'Show Star Paths';
    updateConstellationLines();
    trailSegments = [];
    bioluminescentTrail.style.opacity = '0';
  });

  // Island hover effects
  document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('mouseenter', () => {
      island.style.boxShadow = '0 0 30px var(--color-island-glow)';
    });
    island.addEventListener('mouseleave', () => {
      island.style.boxShadow = '0 0 10px var(--color-island-glow)';
    });
  });
}

// ===== Constellation Lines =====
function updateConstellationLines() {
  constellationLines.forEach(line => {
    line.classList.remove('active');
  });

  if (!activeConstellation) return;

  const points = constellations[activeConstellation];
  if (!points || points.length < 2) return;

  // Find the SVG line for this constellation
  const line = document.querySelector(`.constellation-line.${activeConstellation}`);
  if (!line) return;

  // Set line coordinates (convert % to absolute)
  const rect = starField.getBoundingClientRect();
  const x1 = (points[0].x / 100) * rect.width;
  const y1 = (points[0].y / 100) * rect.height;
  const x2 = (points[points.length - 1].x / 100) * rect.width;
  const y2 = (points[points.length - 1].y / 100) * rect.height;

  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.classList.add('active');

  // Connect intermediate points if constellation has >2 stars
  if (points.length > 2) {
    for (let i = 1; i < points.length; i++) {
      const prevX = (points[i - 1].x / 100) * rect.width;
      const prevY = (points[i - 1].y / 100) * rect.height;
      const currX = (points[i].x / 100) * rect.width;
      const currY = (points[i].y / 100) * rect.height;

      const segmentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      segmentLine.setAttribute('class', `constellation-line ${activeConstellation}-segment`);
      segmentLine.setAttribute('x1', prevX);
      segmentLine.setAttribute('y1', prevY);
      segmentLine.setAttribute('x2', currX);
      segmentLine.setAttribute('y2', currY);
      segmentLine.setAttribute('stroke', 'var(--color-star-glow)');
      segmentLine.setAttribute('stroke-width', '1');
      document.querySelector('.constellation-lines').appendChild(segmentLine);
    }
  }
}

// ===== Bioluminescent Trail =====
function updateTrail() {
  // Add new segment to trail
  trailSegments.push({ ...trailPosition });
  if (trailSegments.length > maxTrailLength) {
    trailSegments.shift();
  }

  // Update trail visibility
  bioluminescentTrail.style.opacity = trailSegments.length > 0 ? '1' : '0';

  // Update trail position (center of the trail)
  if (trailSegments.length > 0) {
    const lastSegment = trailSegments[trailSegments.length - 1];
    bioluminescentTrail.style.setProperty('--trail-x', `${lastSegment.x}px`);
    bioluminescentTrail.style.setProperty('--trail-y', `${lastSegment.y}px`);
  }
}

function startTrailAnimation() {
  // Create trail segments as pseudo-elements via CSS (simplified for performance)
  // Alternative: Use a canvas for smoother trails, but for simplicity, we'll use CSS.
  const style = document.createElement('style');
  style.id = 'trail-styles';
  document.head.appendChild(style);

  function updateTrailStyles() {
    let css = '';
    trailSegments.forEach((segment, index) => {
      const opacity = 1 - (index / trailSegments.length);
      const size = 20 - (index * 1.5);
      css += `
        .bioluminescent-trail::after {
          content: '';
          position: absolute;
          left: ${segment.x}px;
          top: ${segment.y}px;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(0, 212, 255, ${opacity}), transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: trailFade 1s forwards;
        }
      `;
    });
    style.textContent = css;
  }

  // Update trail styles periodically
  setInterval(updateTrailStyles, 100);
}

// ===== Ocean Current Animation =====
function animateOceanCurrents() {
  oceanCurrents.forEach((current, index) => {
    // Randomize animation properties for organic feel
    const speed = 5 + Math.random() * 5;
    const delay = Math.random() * 5;
    current.style.animationDuration = `${speed}s`;
    current.style.animationDelay = `-${delay}s`;
  });
}

// ===== Initialize on Load =====
window.addEventListener('load', init);
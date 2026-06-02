/* ============================================ POLYNESIAN CELESTIAL WAYFINDING CHART Te Wheinā o nga Whetū — JavaScript ============================================ */

/* --- Data: Star Meanings --- */
const starData = {
  Matariki: {
    meaning: "The Pleiades cluster. Marks the beginning of the voyaging season when it rises in the eastern sky before dawn. The eyes of Tāwhirimātea, god of the winds.",
    significance: "Primary seasonal marker for departure"
  },
  Tupuānuku: {
    meaning: "Star of food that grows in the ground. Daughter of Tāne, the god of forests.",
    significance: "Signals planting and harvest times"
  },
  Tupuārangi: {
    meaning: "Star of food that grows in trees. Guardian of the forest canopy.",
    significance: "Indicates fruit gathering seasons"
  },
  Waitī: {
    meaning: "Star of fresh water. Connected to rivers, streams, and the life they sustain.",
    significance: "Guide to freshwater sources"
  },
  Waitā: {
    meaning: "Star of salt water. Guardian of the ocean depths and its creatures.",
    significance: "Protector of ocean voyagers"
  },
  Puanga: {
    meaning: "Rigel, the bright star in Orion. Heralds the rising of Matariki and the new year.",
    significance: "Herald of the new season"
  },
  Pūhutukawa: {
    meaning: "Star connected to the pōhutukawa tree that lines the coasts. A landmark for navigation.",
    significance: "Coastal navigation marker"
  },
  Rehua: {
    meaning: "Antares, the red star of summer. Associated with Tāne and the warmth of the season.",
    significance: "Summer star, guides summer voyages"
  },
  TaumataFeke: {
    meaning: "The star of the octopus. Part of the constellation that tells the story of the great octopus.",
    significance: "Deep sea navigation reference"
  },
  Hōkūleʻa: {
    meaning: "Arcturus, the Star of Joy. The most important star for Hawaiian navigators, rising directly overhead at Hawaii.",
    significance: "Direct guide to the Hawaiian Islands"
  },
  KauOla: {
    meaning: "The traveling star. Used to maintain course across vast distances.",
    significance: "Course correction star"
  }
};

/* --- Data: Island Information --- */
const islandData = {
  Hawaii: {
    description: "The northern apex of the Polynesian Triangle. Hōkūleʻa rises directly overhead here, marking the destination for centuries of voyaging canoes."
  },
  Tahiti: {
    description: "The cultural heart of Polynesia. Known as 'the nearest thing to paradise,' it served as a central hub for navigation and trade."
  },
  Aotearoa: {
    description: "The Land of the Long White Cloud. The great southern continent discovered by Kupe, guided by the stars and ocean swells."
  },
  "Rapa Nui": {
    description: "Easter Island. The most remote inhabited island on Earth, a testament to the extraordinary reach of Polynesian navigation."
  },
  Samoa: {
    description: "The Navigational Crossroads. A central hub where voyagers from across the Pacific would meet and exchange knowledge."
  },
  Fiji: {
    description: "The Island of Giants. Known for its powerful navigators and the construction of massive double-hulled canoes."
  },
  Tonga: {
    description: "The Friendly Islands. A major empire of the Pacific with extensive trade networks spanning thousands of miles."
  },
  Marquesas: {
    description: "The training grounds. Strong navigational traditions were honed here before voyages to distant islands."
  }
};

/* --- Helper Functions --- */
function getStarColor(hex, alpha) {
  switch(hex) {
    case '#ffd700': return `rgba(255, 215, 0, ${alpha})`;
    case '#e8d5b7': return `rgba(232, 213, 183, ${alpha})`;
    case '#ffffff': return `rgba(255, 255, 255, ${alpha})`;
    default: return hex;
  }
}

/* --- Global State --- */
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initStarCanvas();
  initOceanCanvas();
  initConstellationCanvas();
  initStarMarkers();
  initWaypoints();
  initScrollAnimations();
  initCursorEffects();
  initWakeParticles();
});

/* --- Loading Screen --- */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1500);
  });
}

/* --- Star Canvas (Celestial Dome) --- */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationId;

  function resize() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const numStars = Math.floor((canvas.width * canvas.height) / 80);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#ffd700' : Math.random() > 0.5 ? '#e8d5b7' : '#ffffff'
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw faint background gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(13, 33, 55, 0.1)');
    gradient.addColorStop(1, 'rgba(5, 13, 26, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply subtle rotation based on mouse
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rotationX = (mouseX - centerX) / centerX * 0.1;
    const rotationY = (mouseY - centerY) / centerY * 0.1;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationX * 0.2);
    ctx.translate(-centerX, -centerY);

    // Draw stars
    stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const alpha = 0.5 + Math.sin(star.twinklePhase) * 0.5;
      const size = star.size * (0.8 + Math.sin(star.twinklePhase) * 0.2);

      ctx.beginPath();
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fillStyle = getStarColor(star.color, alpha);
      ctx.fill();

      // Add glow to brighter stars
      if (star.brightness > 0.7) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.2})`;
        ctx.fill();
      }
    });

    ctx.restore();

    // Draw constellation lines for Matariki
    const matarikiStars = [
      { x: canvas.width * 0.30, y: canvas.height * 0.25 },
      { x: canvas.width * 0.35, y: canvas.height * 0.20 },
      { x: canvas.width * 0.40, y: canvas.height * 0.28 },
      { x: canvas.width * 0.32, y: canvas.height * 0.35 },
      { x: canvas.width * 0.38, y: canvas.height * 0.32 }
    ];

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    matarikiStars.forEach((star, i) => {
      if (i === 0) ctx.moveTo(star.x, star.y);
      else ctx.lineTo(star.x, star.y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    animationId = requestAnimationFrame(drawStars);
  }

  resize();
  window.addEventListener('resize', resize);
}

/* --- Ocean Canvas (Swell Patterns) --- */
function initOceanCanvas() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let waves = [];
  let time = 0;

  function resize() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    initWaves();
  }

  function initWaves() {
    waves = [];
    const numWaves = 5;
    for (let i = 0; i < numWaves; i++) {
      waves.push({
        amplitude: Math.random() * 30 + 20,
        frequency: Math.random() * 0.01 + 0.005,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        yOffset: canvas.height * (0.3 + i * 0.15),
        color: `rgba(0, 212, 170, ${0.05 - i * 0.008})`
      });
    }
  }

  function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.01;

    // Draw deep ocean background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#1a3a5c');
    bgGradient.addColorStop(0.5, '#0d2137');
    bgGradient.addColorStop(1, '#050d1a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waves
    waves.forEach((wave, index) => {
      wave.phase += wave.speed;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = wave.yOffset + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude + Math.sin(x * wave.frequency * 0.5 + wave.phase * 1.5) * wave.amplitude * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();

      // Add highlight to wave crests
      ctx.strokeStyle = `rgba(77, 166, 255, ${0.1 - index * 0.015})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw current flow lines
    const currentGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    currentGradient.addColorStop(0, 'rgba(0, 212, 170, 0)');
    currentGradient.addColorStop(0.5, 'rgba(0, 212, 170, 0.1)');
    currentGradient.addColorStop(1, 'rgba(0, 212, 170, 0)');
    ctx.fillStyle = currentGradient;
    ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.6, 2);
    ctx.fillRect(canvas.width * 0.3, canvas.height * 0.5, canvas.width * 0.4, 2);
    ctx.fillRect(canvas.width * 0.1, canvas.height * 0.7, canvas.width * 0.8, 2);

    requestAnimationFrame(drawWaves);
  }

  resize();
  window.addEventListener('resize', resize);
}

/* --- Constellation Canvas (Interactive Connect) --- */
function initConstellationCanvas() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let points = [];
  let connections = [];
  let hoveredPoint = null;

  const starColors = {
    matariki: '#ffd700',
    puanga: '#00d4aa',
    taumata: '#ff6b9d'
  };

  function resize() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 32;
    canvas.height = 400;
    drawConstellation();
  }

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function drawConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const bgGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    bgGradient.addColorStop(0, 'rgba(13, 33, 55, 0.3)');
    bgGradient.addColorStop(1, 'rgba(5, 13, 26, 0.5)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.x1, conn.y1);
      ctx.lineTo(conn.x2, conn.y2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw points
    points.forEach((point, index) => {
      const isHovered = hoveredPoint === index;
      const size = isHovered ? 12 : 8;

      // Glow
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
      ctx.fillStyle = getStarColor(point.color, 0.2);
      ctx.fill();

      // Star point
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      if (point.name) {
        ctx.font = '12px "Cormorant Garamond", serif';
        ctx.fillStyle = 'rgba(232, 213, 183, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(point.name, point.x, point.y - 20);
      }
    });
  }

  canvas.addEventListener('click', (e) => {
    const pos = getMousePos(e);
    points.push({
      x: pos.x,
      y: pos.y,
      color: starColors.matariki,
      name: `Star ${points.length + 1}`
    });
    if (points.length > 1) {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      connections.push({
        x1: prev.x,
        y1: prev.y,
        x2: last.x,
        y2: last.y
      });
    }
    drawConstellation();
  });

  canvas.addEventListener('mousemove', (e) => {
    const pos = getMousePos(e);
    hoveredPoint = null;
    points.forEach((point, index) => {
      const dist = Math.hypot(point.x - pos.x, point.y - pos.y);
      if (dist < 20) hoveredPoint = index;
    });
    drawConstellation();
  });

  canvas.addEventListener('dblclick', (e) => {
    e.preventDefault();
    points = [];
    connections = [];
    drawConstellation();
  });

  resize();
  window.addEventListener('resize', resize);
}

/* --- Star Markers (Celestial Dome) --- */
function initStarMarkers() {
  const markers = document.querySelectorAll('.star-marker');
  const infoCard = document.getElementById('starInfo');
  const starNameEl = infoCard?.querySelector('.star-name');
  const starMeaningEl = infoCard?.querySelector('.star-meaning');

  markers.forEach(marker => {
    marker.addEventListener('click', () => {
      const name = marker.dataset.name;
      const data = starData[name] || {
        meaning: 'A guiding star in the vast Pacific.',
        significance: 'Essential for wayfinding'
      };

      if (starNameEl) starNameEl.textContent = name;
      if (starMeaningEl) starMeaningEl.textContent = data.meaning;

      // Add click animation
      marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
      setTimeout(() => {
        marker.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 200);
    });

    marker.addEventListener('mouseenter', () => {
      marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    marker.addEventListener('mouseleave', () => {
      marker.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/* --- Waypoint Markers (Ocean Map) --- */
function initWaypoints() {
  const waypoints = document.querySelectorAll('.waypoint');

  waypoints.forEach(waypoint => {
    waypoint.addEventListener('click', () => {
      const island = waypoint.dataset.island;
      const data = islandData[island] || {
        description: 'A vital stop in the Polynesian voyaging network.'
      };

      // Create or update tooltip
      let tooltip = waypoint.querySelector('.waypoint-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'waypoint-tooltip';
        waypoint.appendChild(tooltip);
      }

      tooltip.textContent = data.description;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(-50%) translateY(10px)';

      // Hide after delay
      setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
      }, 4000);
    });
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe knowledge cards
  document.querySelectorAll('.knowledge-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.19, 1, 0.22, 1) ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
    observer.observe(section);
  });
}

/* --- Cursor Effects --- */
function initCursorEffects() {
  document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  function updateMouse() {
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;
    requestAnimationFrame(updateMouse);
  }
  updateMouse();

  // Add cursor glow effect
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    background: radial-gradient(circle, rgba(0, 212, 170, 0.03) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

/* --- Bioluminescent Wake Enhancement --- */
function initWakeParticles() {
  const container = document.querySelector('.wake-container');
  if (!container) return;

  // Add initial static wake particles
  for (let i = 0; i < 7; i++) {
    const particle = document.createElement('div');
    particle.className = 'wake-particle';
    const x = 20 + i * 5;
    particle.style.setProperty('--x', x + '%');
    particle.style.setProperty('--delay', i * 0.5 + 's');
    particle.style.left = x + '%';
    container.appendChild(particle);
  }

  // Add dynamic wake particles over time
  setInterval(() => {
    const particle = document.createElement('div');
    particle.className = 'wake-particle';
    const x = Math.random() * 60 + 10; // Keep particles in the left 70% of the screen
    particle.style.setProperty('--x', x + '%');
    particle.style.setProperty('--delay', Math.random() * 2 + 's');
    particle.style.left = x + '%';
    container.appendChild(particle);

    // Remove after animation completes
    setTimeout(() => {
      particle.remove();
    }, 8000);
  }, 600);
}
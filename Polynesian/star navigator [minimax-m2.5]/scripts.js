/* ======================================== POLYNESIAN CELESTIAL WAYFINDING JavaScript Interactive Features ======================================== */ 
document.addEventListener('DOMContentLoaded', () => {
  // Wait for fonts to load
  setTimeout(init, 500);
});

function init() {
  // Hide loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.add('hidden');
  
  // Initialize all features
  initStarField();
  initWakeTrail();
  initCompass();
  initIslandMap();
  initConstellations();
  initWavePatterns();
  initNavigationMarkers();
  initCursorFollower();
  initInfoPanel();
  initParticles();
  initHoverEffects();
}

/* ======================================== STAR FIELD WITH ROTATING DOME ======================================== */ 
function initStarField() {
  const canvas = document.getElementById('starField');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const numStars = 400;
  let mouseX = 0;
  mouseY = 0;
  let rotationAngle = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        radius: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        originalY: Math.random() * canvas.height * 0.7,
        color: getStarColor()
      });
    }
  }

  function getStarColor() {
    const colors = ['#f0f4ff', '#ffd700', '#ff9f6b', '#9bb0ff', '#fffae6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.3, 0,
      canvas.width / 2, canvas.height * 0.3, canvas.height
    );
    gradient.addColorStop(0, '#0d2847');
    gradient.addColorStop(0.5, '#0a1628');
    gradient.addColorStop(1, '#050d18');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate rotation based on mouse position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    rotationAngle = (mouseX - centerX) / centerX * 0.2;

    // Draw stars
    stars.forEach((star, index) => {
      // Apply rotation effect
      const angle = rotationAngle * (star.y / canvas.height);
      const rotatedX = star.x + Math.sin(angle) * 30 * (star.y / canvas.height);
      
      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
      
      ctx.beginPath();
      ctx.arc(rotatedX, star.y, star.radius * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.brightness * twinkle;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Add glow to brighter stars
      if (star.brightness > 0.8) {
        ctx.beginPath();
        ctx.arc(rotatedX, star.y, star.radius * 3, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(rotatedX, star.y, 0, rotatedX, star.y, star.radius * 3);
        glowGradient.addColorStop(0, star.color);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    // Draw some constellation lines
    const time = Date.now() * 0.001;
    ctx.strokeStyle = 'rgba(100, 180, 255, 0.1)';
    ctx.lineWidth = 1;
    drawConstellationLines(ctx, canvas.width, canvas.height, time);
    
    requestAnimationFrame(draw);
  }

  function drawConstellationLines(ctx, width, height, time) {
    ctx.beginPath();
    // Horizontal curved line suggesting celestial equator
    ctx.moveTo(0, height * 0.4);
    ctx.bezierCurveTo(
      width * 0.25, height * 0.38 + Math.sin(time) * 10,
      width * 0.75, height * 0.42 + Math.sin(time) * 10,
      width, height * 0.4
    );
    ctx.stroke();
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ======================================== BIOLUMINESCENT WAKE TRAIL ======================================== */ 
function initWakeTrail() {
  const canvas = document.getElementById('wakeTrail');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const maxParticles = 100;
  let mouseX = 0, mouseY = 0;
  let isMoving = false;
  let moveTimeout;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 + 1,
      size: Math.random() * 4 + 2,
      life: 1,
      decay: Math.random() * 0.01 + 0.005,
      color: Math.random() > 0.5 ? '#00ffff' : '#008b8b'
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create particles when moving
    if (isMoving) {
      for (let i = 0; i < 3; i++) {
        if (particles.length < maxParticles) {
          particles.push(createParticle(mouseX, mouseY));
        }
      }
    }

    // Update and draw particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size *= 0.98;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.6;
      ctx.fill();
      
      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = p.life * 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    
    requestAnimationFrame(draw);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });
  
  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ======================================== COMPASS INTERACTION ======================================== */ 
function initCompass() {
  const directionMarkers = document.querySelectorAll('.direction-marker, .star-house');
  const compassRings = document.querySelectorAll('.compass-ring');

  directionMarkers.forEach(marker => {
    marker.addEventListener('mouseenter', (e) => {
      const direction = marker.dataset.direction || marker.dataset.house;
      const stars = marker.dataset.stars || '';
      showCompassGlow(marker, true);
      showInfoPanel(direction, stars);
    });
    
    marker.addEventListener('mouseleave', () => {
      showCompassGlow(marker, false);
      hideInfoPanel();
    });
  });

  function showCompassGlow(marker, show) {
    if (show) {
      marker.style.filter = 'drop-shadow(0 0 15px #ffd700)';
    } else {
      marker.style.filter = 'none';
    }
  }

  // Rotate compass based on cursor
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const rotation = angle * (180 / Math.PI) * 0.05;
    compassRings.forEach(ring => {
      ring.style.transform = `rotate(${rotation}deg)`;
    });
  });
}

/* ======================================== ISLAND MAP INTERACTION ======================================== */ 
function initIslandMap() {
  const canvas = document.getElementById('islandMap');
  const ctx = canvas.getContext('2d');
  const waypoints = document.querySelectorAll('.waypoint');
  let animationFrame;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    drawMap();
  }

  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(100, 180, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw wave pattern hints
    const time = Date.now() * 0.001;
    ctx.strokeStyle = 'rgba(45, 107, 138, 0.2)';
    ctx.lineWidth = 1;
    for (let y = 20; y < canvas.height; y += 60) {
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const yOffset = Math.sin(x * 0.02 + time + y * 0.01) * 10;
        if (x === 0) {
          ctx.moveTo(x, y + yOffset);
        } else {
          ctx.lineTo(x, y + yOffset);
        }
      }
      ctx.stroke();
    }
  }

  function animate() {
    drawMap();
    animationFrame = requestAnimationFrame(animate);
  }

  // Waypoint interactions
  waypoints.forEach(waypoint => {
    waypoint.addEventListener('mouseenter', (e) => {
      const island = waypoint.dataset.island;
      const lat = waypoint.dataset.lat;
      const lon = waypoint.dataset.lon;
      showInfoPanel(island, `Coordinates: ${lat}, ${lon}<br>One of the great islands of the Polynesian triangle.`);
    });
    waypoint.addEventListener('mouseleave', hideInfoPanel);
  });

  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ======================================== CONSTELLATION CONNECTOR ======================================== */ 
function initConstellations() {
  const canvas = document.getElementById('constellationCanvas');
  const ctx = canvas.getContext('2d');
  const buttons = document.querySelectorAll('.constellation-btn');
  const nameEl = document.getElementById('constellationName');
  const descEl = document.getElementById('constellationDesc');
  let currentConstellation = 'all';
  let stars = [];
  let connectedStars = [];

  const constellations = {
    all: {
      name: 'All Stars',
      desc: 'Ancient Polynesian navigators used these star groupings to navigate across the Pacific.',
      stars: generateAllStars()
    },
    pleiades: {
      name: 'Makali\'i (Pleiades)',
      desc: 'The Seven Sisters - rising in late October marks the beginning of the sailing season in Hawai\'i.',
      stars: generatePleiades()
    },
    orion: {
      name: 'Ka Mao (Orion)',
      desc: 'The Navigator - the belt stars (Ka Mao) indicate east and west, essential for navigation.',
      stars: generateOrion()
    },
    'southern-cross': {
      name: 'Southern Cross',
      desc: 'Used to find south when navigating in the southern hemisphere waters.',
      stars: generateSouthernCross()
    },
    scorpion: {
      name: 'Maui\'s Fishhook',
      desc: 'Scorpio - represents the fishhook of the demigod Maui, used to pull up the islands.',
      stars: generateScorpion()
    }
  };

  function generateAllStars() {
    const allStars = [];
    for (let i = 0; i < 80; i++) {
      allStars.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        size: Math.random() * 2 + 1,
        brightness: Math.random()
      });
    }
    return allStars;
  }

  function generatePleiades() {
    const cx = 200, cy = 150;
    return [
      { x: cx - 30, y: cy - 20, size: 3, brightness: 1 },
      { x: cx - 10, y: cy - 35, size: 2.5, brightness: 1 },
      { x: cx + 15, y: cy - 30, size: 3, brightness: 1 },
      { x: cx + 35, y: cy - 15, size: 2, brightness: 0.8 },
      { x: cx - 5, y: cy - 5, size: 2.5, brightness: 0.9 },
      { x: cx + 20, y: cy + 5, size: 2, brightness: 0.7 },
      { x: cx - 20, y: cy + 15, size: 2, brightness: 0.6 }
    ];
  }

  function generateOrion() {
    const cx = 400, cy = 180;
    return [
      // Belt
      { x: cx - 30, y: cy, size: 3, brightness: 1 },
      { x: cx, y: cy, size: 3, brightness: 1 },
      { x: cx + 30, y: cy, size: 3, brightness: 1 },
      // Body
      { x: cx, y: cy - 50, size: 4, brightness: 1 },
      { x: cx, y: cy + 40, size: 3.5, brightness: 1 },
      // Arms
      { x: cx - 60, y: cy - 20, size: 2.5, brightness: 0.8 },
      { x: cx + 60, y: cy - 20, size: 2.5, brightness: 0.8 },
      // Shoulders
      { x: cx - 40, y: cy - 50, size: 2.5, brightness: 0.9 },
      { x: cx + 40, y: cy - 50, size: 2.5, brightness: 0.9 },
      // Legs
      { x: cx - 25, y: cy + 80, size: 2, brightness: 0.7 },
      { x: cx + 25, y: cy + 80, size: 2, brightness: 0.7 }
    ];
  }

  function generateSouthernCross() {
    const cx = 600, cy = 200;
    return [
      { x: cx, y: cy - 40, size: 3, brightness: 1 },
      { x: cx - 25, y: cy, size: 2.5, brightness: 1 },
      { x: cx + 25, y: cy, size: 2.5, brightness: 1 },
      { x: cx - 10, y: cy + 30, size: 2, brightness: 0.8 },
      { x: cx + 10, y: cy + 30, size: 3.5, brightness: 1 }
    ];
  }

  function generateScorpion() {
    const cx = 500, cy = 300;
    const points = [];
    // Body curve
    for (let i = 0; i < 7; i++) {
      points.push({
        x: cx - 80 + i * 20,
        y: cy + Math.sin(i * 0.8) * 30,
        size: 2 + Math.random(),
        brightness: 0.7 + Math.random() * 0.3
      });
    }
    // Stinger
    points.push({ x: cx + 60, y: cy - 20, size: 2.5, brightness: 1 });
    points.push({ x: cx + 80, y: cy - 40, size: 2, brightness: 0.9 });
    points.push({ x: cx + 75, y: cy - 55, size: 3, brightness: 1 });
    // Claws
    points.push({ x: cx - 90, y: cy - 20, size: 2, brightness: 0.8 });
    points.push({ x: cx - 100, y: cy - 35, size: 1.5, brightness: 0.7 });
    return points;
  }

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dark background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(1, '#0d2847');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get current constellation stars
    const constellation = constellations[currentConstellation];
    stars = constellation.stars.map(s => ({
      ...s,
      x: (s.x / 800) * canvas.width,
      y: (s.y / 400) * canvas.height * 0.8 + 50
    }));

    // Draw constellation lines
    if (currentConstellation !== 'all') {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      drawConstellationLines();
      ctx.setLineDash([]);
    }

    // Draw stars
    const time = Date.now() * 0.003;
    stars.forEach((star, index) => {
      const twinkle = Math.sin(time + index) * 0.3 + 0.7;
      
      // Star glow
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
      glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Star core
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = star.brightness > 0.8 ? '#ffd700' : '#f0f4ff';
      ctx.fill();
    });

    // Draw connecting lines for user interaction
    if (connectedStars.length > 1) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(connectedStars[0].x, connectedStars[0].y);
      for (let i = 1; i < connectedStars.length; i++) {
        ctx.lineTo(connectedStars[i].x, connectedStars[i].y);
      }
      ctx.stroke();
    }
    
    requestAnimationFrame(draw);
  }

  function drawConstellationLines() {
    const connections = {
      pleiades: [[0,1],[1,2],[2,3],[2,4],[4,5],[4,6]],
      orion: [[0,1],[1,2],[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,3],[6,3],[7,0],[8,2],[9,4],[10,4]],
      'southern-cross': [[0,1],[0,2],[1,3],[2,3],[3,4]],
      scorpion: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,7],[7,8]]
    };
    
    const conns = connections[currentConstellation];
    if (!conns) return;
    
    conns.forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(stars[from].x, stars[from].y);
      ctx.lineTo(stars[to].x, stars[to].y);
      ctx.stroke();
    });
  }

  // Canvas click to add stars to connection
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find nearest star
    const nearest = stars.find(star => {
      const dx = star.x - x;
      const dy = star.y - y;
      return Math.sqrt(dx*dx + dy*dy) < 20;
    });
    
    if (nearest) {
      if (!connectedStars.find(s => s === nearest)) {
        connectedStars.push(nearest);
      }
    } else {
      connectedStars = []; // Clear if clicking empty space
    }
  });

  // Button interactions
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentConstellation = btn.dataset.constellation;
      const data = constellations[currentConstellation];
      nameEl.textContent = data.name;
      descEl.textContent = data.desc;
      connectedStars = [];
    });
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ======================================== WAVE PATTERN VISUALIZATION ======================================== */ 
function initWavePatterns() {
  const patterns = document.querySelectorAll('.wave-pattern');
  
  patterns.forEach(pattern => {
    const canvasId = pattern.querySelector('.wave-canvas').id;
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const patternType = pattern.dataset.pattern;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.002;
      
      // Different wave patterns based on type
      const waveParams = {
        northern: { amplitude: 15, frequency: 0.02, speed: 1, offset: 0, color: 'rgba(100, 180, 255, 0.5)' },
        southern: { amplitude: 20, frequency: 0.015, speed: 0.8, offset: Math.PI, color: 'rgba(80, 200, 255, 0.5)' },
        trades: { amplitude: 12, frequency: 0.025, speed: 1.2, offset: Math.PI / 2, color: 'rgba(120, 200, 255, 0.4)' }
      };
      
      const params = waveParams[patternType];

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = params.color;
        ctx.lineWidth = 2 - layer * 0.5;
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * params.frequency + time * params.speed + params.offset + layer) * params.amplitude * (1 - layer * 0.2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Add some floating particles
      for (let i = 0; i < 5; i++) {
        const px = (time * 30 + i * 80) % canvas.width;
        const py = canvas.height / 2 + Math.sin(px * params.frequency + time * params.speed) * params.amplitude * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.fill();
      }
      
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  });
}

/* ======================================== NAVIGATION MARKERS ======================================== */ 
function initNavigationMarkers() {
  const markers = document.querySelectorAll('.navigation-marker');
  
  markers.forEach(marker => {
    marker.addEventListener('mouseenter', () => {
      const markerType = marker.dataset.marker;
      const titles = {
        'stick-charts': 'Stick Charts',
        'seastate': 'Sea State Reading',
        'birds': 'Bird Navigation',
        'clouds': 'Cloud Reading'
      };
      const descriptions = {
        'stick-charts': 'Carved coconut midribs showing island positions relative to swell patterns. These portable charts were memorized and recreated from memory for each voyage.',
        'seastate': 'Master navigators read the ocean like a book - detecting swells from distant storms, noting changes in wave direction that indicate nearby land.',
        'birds': 'Frigatebirds and noddies return to land at sunset. Following their flight path can lead to islands within 40 miles.',
        'clouds': 'Distant islands create unique cloud formations. The "cloud island" effect - reflection of land in cloud shapes - can be seen from 100 miles away.'
      };
      showInfoPanel(titles[markerType], descriptions[markerType]);
    });
    
    marker.addEventListener('mouseleave', hideInfoPanel);
  });
}

/* ======================================== CURSOR FOLLOWER ======================================== */ 
function initCursorFollower() {
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    follower.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    follower.classList.remove('active');
  });

  function update() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(update);
  }
  
  update();
}

/* ======================================== INFO PANEL ======================================== */ 
function initInfoPanel() {
  const panel = document.getElementById('infoPanel');
  const closeBtn = panel.querySelector('.close-panel');
  
  closeBtn.addEventListener('click', hideInfoPanel);
  panel.addEventListener('click', (e) => {
    if (e.target === panel) hideInfoPanel();
  });
}

function showInfoPanel(title, description) {
  const panel = document.getElementById('infoPanel');
  document.getElementById('panelTitle').textContent = title;
  document.getElementById('panelDescription').innerHTML = description;
  panel.classList.add('active');
}

function hideInfoPanel() {
  const panel = document.getElementById('infoPanel');
  panel.classList.remove('active');
}

/* ======================================== FLOATING PARTICLES ======================================== */ 
function initParticles() {
  const body = document.body;
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    body.appendChild(particle);
  }
}

/* ======================================== HOVER EFFECTS ======================================== */ 
function initHoverEffects() {
  // Add hover sound effect simulation (visual feedback)
  const interactiveElements = document.querySelectorAll('.waypoint, .direction-marker, .star-house, .navigation-marker, .constellation-btn');
  interactiveElements.forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });

  // Parallax effect on scroll
  document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.section-title').forEach(title => {
      title.style.transform = `translateY(${scrolled * 0.05}px)`;
    });
  });
}
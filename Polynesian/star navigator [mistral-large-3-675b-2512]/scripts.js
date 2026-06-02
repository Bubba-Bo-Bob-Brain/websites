// ===== POLYNESIAN WAYFINDING CHART =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== 1. STAR DOME PARALLAX =====
  const starDome = document.querySelector('.star-dome');
  const domeLayers = document.querySelectorAll('.dome-layer');

  // Rotate star dome based on cursor position
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rotateX = (clientY - centerY) * 0.02;
    const rotateY = (clientX - centerX) * 0.02;

    domeLayers.forEach((layer, i) => {
      const depth = 1 - (i * 0.3); // Layers farther back move slower
      layer.style.transform = `rotateX(${rotateX * depth}deg) rotateY(${rotateY * depth}deg)`;
    });
  });

  // ===== 2. CONSTELLATION CONNECT-THE-DOTS =====
  const constellations = document.querySelectorAll('.constellation');
  const starPathElements = document.querySelectorAll('.star-path');

  // Highlight constellation on star click
  constellations.forEach((constellation) => {
    const stars = constellation.querySelectorAll('.star');
    const constellationName = constellation.dataset.name;
    let activeStars = [];

    stars.forEach((star) => {
      star.addEventListener('click', () => {
        star.classList.toggle('active');
        activeStars = constellation.querySelectorAll('.star.active');

        // Draw path between active stars
        if (activeStars.length >= 2) {
          const path = document.querySelector(`.star-path[data-constellation="${constellationName}"]`);
          if (path) path.style.opacity = '1';
        } else {
          const path = document.querySelector(`.star-path[data-constellation="${constellationName}"]`);
          if (path) path.style.opacity = '0.6';
        }

        // Show tooltip with lore
        showTooltip(`Constellation: ${constellationName}<br>Lore: "The path of ${constellationName}, used by navigators to find ${constellationName === 'Manaiakalani' ? 'Hawaiʻi' : 'Tahiti'}."`, star);
      });
    });
  });

  // ===== 3. BIO-LUMINESCENT WAKE TRAIL =====
  const wakeCanvas = document.getElementById('wake-trail');
  const ctx = wakeCanvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    wakeCanvas.width = window.innerWidth;
    wakeCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Wake trail effect
  let wakePositions = [];
  const maxWakeLength = 30;

  document.addEventListener('mousemove', (e) => {
    wakePositions.push({ x: e.clientX, y: e.clientY });
    if (wakePositions.length > maxWakeLength) wakePositions.shift();
    drawWake();
  });

  function drawWake() {
    ctx.clearRect(0, 0, wakeCanvas.width, wakeCanvas.height);
    wakePositions.forEach((pos, i) => {
      const opacity = i / wakePositions.length;
      const size = 10 * opacity;
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
      gradient.addColorStop(0, `rgba(77, 150, 179, ${opacity})`);
      gradient.addColorStop(1, `rgba(248, 255, 149, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ===== 4. TOOLTIPS =====
  const tooltip = document.getElementById('tooltip');

  function showTooltip(content, element) {
    const rect = element.getBoundingClientRect();
    tooltip.innerHTML = content;
    tooltip.style.opacity = '1';
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
  }

  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  // Add tooltip listeners to islands
  const islands = document.querySelectorAll('.island');
  islands.forEach((island) => {
    island.addEventListener('mouseenter', () => {
      const name = island.dataset.name;
      const lore = island.dataset.lore;
      showTooltip(`Island: ${name}<br>Lore: ${lore}`, island);
    });
    island.addEventListener('mouseleave', hideTooltip);
  });

  // ===== 5. TIKI BUTTON CONTROLS =====
  const toggleOceanBtn = document.getElementById('toggle-ocean');
  const toggleConstellationsBtn = document.getElementById('toggle-constellations');
  const oceanCurrents = document.querySelector('.ocean-currents');

  toggleOceanBtn.addEventListener('click', () => {
    oceanCurrents.style.opacity = oceanCurrents.style.opacity === '0' ? '0.8' : '0';
  });

  toggleConstellationsBtn.addEventListener('click', () => {
    starPathElements.forEach(path => {
      path.style.opacity = path.style.opacity === '0' ? '0.6' : '0';
    });
  });

  // ===== 6. INITIAL ANIMATIONS =====
  // Fade in chart on load
  const chartContainer = document.querySelector('.chart-container');
  chartContainer.style.opacity = '0';
  chartContainer.style.transform = 'translateY(20px)';
  setTimeout(() => {
    chartContainer.style.transition = 'opacity 1s, transform 1s';
    chartContainer.style.opacity = '1';
    chartContainer.style.transform = 'translateY(0)';
  }, 300);

  // Animate ocean currents on load
  const currents = document.querySelectorAll('.current');
  currents.forEach((current, i) => {
    current.style.opacity = '0';
    current.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      current.style.transition = `opacity 1s ${i * 0.3}s, transform 1s ${i * 0.3}s`;
      current.style.opacity = '1';
      current.style.transform = 'translateX(0)';
    }, 500);
  });
});
(function() {
  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas.getContext('2d');
  const dome = document.getElementById('celestial-dome');
  const compassRing = document.getElementById('star-compass-ring');
  const constellationSvg = document.getElementById('constellation-svg');
  const loreItems = document.querySelectorAll('.lore-item');
  const swellDirectionSpan = document.getElementById('swell-direction');
  const tooltip = document.getElementById('tooltip');
  const islandMarkers = document.querySelectorAll('.island');
  const wavePath1 = document.getElementById('wave-path-1');
  const wavePath2 = document.getElementById('wave-path-2');
  const wavePath3 = document.getElementById('wave-path-3');
  const bioluminescence = document.getElementById('bioluminescence');

  let width, height;
  let stars = [];
  const STAR_COUNT = 380;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;
  let animationFrame;
  let waveOffset = 0;

  const constellationStars = [
    { id: 'star1', cx: 120, cy: 180, name: 'Hōkūpa\'a' },
    { id: 'star2', cx: 210, cy: 130, name: 'Nā Hiku' },
    { id: 'star3', cx: 280, cy: 200, name: 'Ta\'urua' },
    { id: 'star4', cx: 400, cy: 140, name: 'Matariki' },
    { id: 'star5', cx: 520, cy: 210, name: 'Tautoru' },
    { id: 'star6', cx: 630, cy: 160, name: 'Newe' },
    { id: 'star7', cx: 700, cy: 270, name: 'Magellanic' },
    { id: 'star8', cx: 560, cy: 340, name: 'Southern Cross' },
    { id: 'star9', cx: 340, cy: 350, name: 'Kākā' },
    { id: 'star10', cx: 190, cy: 300, name: 'Manu' }
  ];

  const constellationLines = [
    ['star1', 'star2'], ['star2', 'star3'], ['star3', 'star4'],
    ['star4', 'star5'], ['star5', 'star6'], ['star6', 'star7'],
    ['star7', 'star8'], ['star8', 'star9'], ['star9', 'star10'],
    ['star10', 'star1'], ['star4', 'star9'], ['star2', 'star5']
  ];

  const swellDirections = [
    'North-Northeast', 'East-Southeast', 'South-Southwest', 'West-Northwest',
    'Northeast', 'Southeast', 'Southwest', 'Northwest'
  ];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    generateStars();
  }

  function generateStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radius: Math.random() * 2.2 + 0.6,
        brightness: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStarfield() {
    ctx.clearRect(0, 0, width, height);
    const time = Date.now() * 0.001;
    
    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed * 40 + star.twinkleOffset) * 0.4 + 0.6;
      const alpha = star.brightness * twinkle * 0.9;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2);
      gradient.addColorStop(0, `rgba(255, 248, 231, ${alpha})`);
      gradient.addColorStop(0.6, `rgba(200, 180, 150, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(200, 180, 150, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      if (star.radius > 1.8 && twinkle > 0.85) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 240, ${alpha * 0.2})`;
        ctx.fill();
      }
    });
  }

  function buildConstellationMap() {
    constellationSvg.innerHTML = '';
    
    constellationLines.forEach(([idA, idB]) => {
      const starA = constellationStars.find(s => s.id === idA);
      const starB = constellationStars.find(s => s.id === idB);
      if (!starA || !starB) return;
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute('x1', starA.cx);
      line.setAttribute('y1', starA.cy);
      line.setAttribute('x2', starB.cx);
      line.setAttribute('y2', starB.cy);
      line.setAttribute('stroke', 'rgba(46, 184, 176, 0.35)');
      line.setAttribute('stroke-width', '1.2');
      line.setAttribute('stroke-dasharray', '4 6');
      constellationSvg.appendChild(line);
    });

    constellationStars.forEach(star => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute('cx', star.cx);
      circle.setAttribute('cy', star.cy);
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#fff8e7');
      circle.setAttribute('filter', 'url(#glow)');
      circle.style.cursor = 'pointer';
      circle.dataset.name = star.name;
      
      circle.addEventListener('mouseenter', (e) => {
        tooltip.style.opacity = '1';
        tooltip.textContent = star.name;
        updateTooltipPosition(e);
      });
      circle.addEventListener('mousemove', updateTooltipPosition);
      circle.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
      
      constellationSvg.appendChild(circle);
    });

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute('id', 'glow');
    filter.innerHTML = '<feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(filter);
    constellationSvg.insertBefore(defs, constellationSvg.firstChild);
  }

  function updateTooltipPosition(e) {
    tooltip.style.left = e.clientX + 18 + 'px';
    tooltip.style.top = e.clientY - 30 + 'px';
  }

  function handleIslandInteraction() {
    islandMarkers.forEach(island => {
      island.addEventListener('mouseenter', (e) => {
        const name = island.dataset.name;
        tooltip.style.opacity = '1';
        tooltip.textContent = name;
        updateTooltipPosition(e);
        
        const loreId = `lore-${name.toLowerCase().replace(/[^a-z]/g, '')}`;
        activateLore(loreId);
      });
      
      island.addEventListener('mousemove', updateTooltipPosition);
      
      island.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        activateLore('lore-default');
      });
    });
  }

  function activateLore(activeId) {
    loreItems.forEach(item => {
      item.classList.remove('active');
      if (item.id === activeId) {
        item.classList.add('active');
      }
    });
  }

  function updateCompassRing() {
    const moveX = (targetMouseX / window.innerWidth - 0.5) * 12;
    const moveY = (targetMouseY / window.innerHeight - 0.5) * 8;
    compassRing.style.transform = `translate(-50%, -30%) rotateX(65deg) rotate(${moveX * 0.5}deg) translateY(${moveY}px)`;
  }

  function animateWaves() {
    waveOffset += 0.008;
    const w1 = generateWavePath(0.4, 0.7, waveOffset, 18);
    const w2 = generateWavePath(0.7, 0.9, waveOffset * 1.3, 24);
    const w3 = generateWavePath(1.0, 1.1, waveOffset * 1.7, 30);
    
    wavePath1.setAttribute('d', w1);
    wavePath2.setAttribute('d', w2);
    wavePath3.setAttribute('d', w3);
    
    bioluminescence.style.opacity = 0.4 + Math.sin(waveOffset * 3) * 0.15;
  }

  function generateWavePath(amplitudeScale, frequencyScale, offset, baseY) {
    const points = 8;
    let d = `M 0 ${baseY + 120} `;
    const step = 1440 / points;
    
    for (let i = 0; i <= points; i++) {
      const x = i * step;
      const y = baseY + Math.sin(i * frequencyScale + offset) * 22 * amplitudeScale + Math.cos(i * 0.7 + offset * 0.6) * 10;
      d += `L ${x} ${y} `;
    }
    d += `L 1440 320 L 0 320 Z`;
    return d;
  }

  function updateSwellDirection() {
    const index = Math.floor(Date.now() / 4000) % swellDirections.length;
    swellDirectionSpan.textContent = swellDirections[index];
  }

  function animationLoop() {
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;
    
    drawStarfield();
    updateCompassRing();
    animateWaves();
    
    animationFrame = requestAnimationFrame(animationLoop);
  }

  function onMouseMove(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      targetMouseX = e.touches[0].clientX;
      targetMouseY = e.touches[0].clientY;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  
  resizeCanvas();
  buildConstellationMap();
  handleIslandInteraction();
  animationLoop();
  
  setInterval(updateSwellDirection, 4000);
  updateSwellDirection();
})();
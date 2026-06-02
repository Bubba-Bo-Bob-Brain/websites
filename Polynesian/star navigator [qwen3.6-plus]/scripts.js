/* =========================================
   POLYNESIAN CELESTIAL WAYFINDING CHART
   scripts.js
   ========================================= */

(function () {
  'use strict';

  // =========================================
  // 1. STATE & CONFIGURATION
  // =========================================
  const state = {
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    targetAngle: 0,
    currentAngle: 0,
    time: 0,
    isLoaded: false,
    showConstellations: false,
    showCurrents: true,
    showStarPaths: true,
    trail: [],
    stars: [],
    constellationNodes: [],
    connectedPath: [],
    waveLayers: 4,
    animFrameId: null
  };

  // DOM References
  const dom = {
    starCanvas: null,
    starCtx: null,
    waveCanvas: null,
    waveCtx: null,
    trailCanvas: null,
    trailCtx: null,
    compass: null,
    tooltip: null,
    loadingScreen: null,
    loadingBar: null,
    constellationOverlay: null,
    constellationLines: null,
    constellationNodesGroup: null,
    infoPanel: null,
    btnToggleConstellations: null,
    btnToggleCurrents: null,
    btnToggleStarPaths: null,
    btnResetView: null,
    islands: null
  };

  // =========================================
  // 2. INITIALIZATION
  // =========================================
  function init() {
    cacheDOM();
    setupEventListeners();
    generateStars();
    generateConstellationNodes();
    initLoadingSequence();
  }

  function cacheDOM() {
    dom.starCanvas = document.getElementById('starCanvas');
    dom.starCtx = dom.starCanvas.getContext('2d');
    dom.waveCanvas = document.getElementById('waveCanvas');
    dom.waveCtx = dom.waveCanvas.getContext('2d');
    dom.trailCanvas = document.getElementById('trailCanvas');
    dom.trailCtx = dom.trailCanvas.getContext('2d');
    dom.compass = document.getElementById('starCompass');
    dom.tooltip = document.getElementById('tooltip');
    dom.loadingScreen = document.getElementById('loadingScreen');
    dom.loadingBar = document.getElementById('loadingBar');
    dom.constellationOverlay = document.getElementById('constellationSvg');
    dom.constellationLines = document.getElementById('constellationLines');
    dom.constellationNodesGroup = document.getElementById('constellationNodes');
    dom.infoPanel = document.getElementById('infoPanel');
    dom.btnToggleConstellations = document.getElementById('btnToggleConstellations');
    dom.btnToggleCurrents = document.getElementById('btnToggleCurrents');
    dom.btnToggleStarPaths = document.getElementById('btnToggleStarPaths');
    dom.btnResetView = document.getElementById('btnResetView');
    dom.islands = document.querySelectorAll('.island');

    resizeCanvases();
  }

  function setupEventListeners() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleCanvasClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // UI Controls
    dom.btnToggleConstellations.addEventListener('click', toggleConstellations);
    dom.btnToggleCurrents.addEventListener('click', toggleCurrents);
    dom.btnToggleStarPaths.addEventListener('click', toggleStarPaths);
    dom.btnResetView.addEventListener('click', resetView);
    
    // Island Interactions
    dom.islands.forEach(island => {
      island.addEventListener('mouseenter', (e) => showTooltip(e, island));
      island.addEventListener('mouseleave', hideTooltip);
      island.addEventListener('click', (e) => handleIslandClick(e, island));
    });
  }

  // =========================================
  // 3. CANVAS RESIZING & STAR GENERATION
  // =========================================
  function resizeCanvases() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.centerX = state.width / 2;
    state.centerY = state.height / 2;

    [dom.starCanvas, dom.waveCanvas, dom.trailCanvas].forEach(canvas => {
      canvas.width = state.width;
      canvas.height = state.height;
    });

    // Regenerate stars with normalized positions
    generateStars();
    updateConstellationNodePositions();
  }

  function handleResize() {
    resizeCanvases();
  }

  function generateStars() {
    state.stars = [];
    const count = 450;
    for (let i = 0; i < count; i++) {
      state.stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.2 + 0.4,
        baseAlpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        parallaxDepth: Math.random() * 3 + 1,
        color: getRandomStarColor()
      });
    }
  }

  function getRandomStarColor() {
    const colors = ['#ffffff', '#fffdf0', '#89cff0', '#f4d03f', '#e8e4db'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // =========================================
  // 4. CONSTELLATION SYSTEM
  // =========================================
  function generateConstellationNodes() {
    // Predefined interactive star positions (normalized)
    const baseNodes = [
      { id: 'n1', nx: 0.35, ny: 0.25, name: 'Hōkūleʻa' },
      { id: 'n2', nx: 0.45, ny: 0.20, name: 'Hikianalia' },
      { id: 'n3', nx: 0.28, ny: 0.40, name: 'Ka Makau Nui' },
      { id: 'n4', nx: 0.60, ny: 0.35, name: 'Nānāhoa' },
      { id: 'n5', nx: 0.55, ny: 0.50, name: 'ʻAʻā' },
      { id: 'n6', nx: 0.40, ny: 0.65, name: 'Ke Ka o Makaliʻi' },
      { id: 'n7', nx: 0.70, ny: 0.25, name: 'Pleiades' }
    ];

    state.constellationNodes = baseNodes.map(node => ({
      ...node,
      x: node.nx * state.width,
      y: node.ny * state.height,
      radius: 6,
      active: false,
      connected: false
    }));

    renderConstellationSVG();
  }

  function updateConstellationNodePositions() {
    state.constellationNodes.forEach(node => {
      node.x = node.nx * state.width;
      node.y = node.ny * state.height;
    });
    renderConstellationSVG();
  }

  function renderConstellationSVG() {
    // Clear existing
    dom.constellationLines.innerHTML = '';
    dom.constellationNodesGroup.innerHTML = '';

    if (!state.showConstellations) return;

    // Draw connected lines
    if (state.connectedPath.length > 1) {
      let d = `M ${state.connectedPath[0].x} ${state.connectedPath[0].y}`;
      for (let i = 1; i < state.connectedPath.length; i++) {
        d += ` L ${state.connectedPath[i].x} ${state.connectedPath[i].y}`;
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', '#f4d03f');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.7');
      path.style.animation = 'dash-flow 10s linear infinite';
      dom.constellationLines.appendChild(path);
    }

    // Draw nodes
    state.constellationNodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.connected ? 8 : 5);
      circle.setAttribute('fill', node.connected ? '#00f5d4' : '#fffdf0');
      circle.setAttribute('stroke', node.connected ? '#00b4d8' : '#f4d03f');
      circle.setAttribute('stroke-width', '1');
      circle.dataset.id = node.id;
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', (e) => handleNodeClick(e, node));
      dom.constellationNodesGroup.appendChild(circle);
    });
  }

  function handleNodeClick(e, node) {
    e.stopPropagation();
    if (!state.showConstellations) return;

    if (!node.connected) {
      node.connected = true;
      state.connectedPath.push(node);
      playSound('connect'); // Optional visual feedback handled via CSS
    } else {
      node.connected = false;
      state.connectedPath = state.connectedPath.filter(n => n.id !== node.id);
    }
    renderConstellationSVG();
  }

  function handleCanvasClick(e) {
    // Clear constellation path if clicking empty space
    if (e.target === dom.starCanvas || e.target === dom.waveCanvas) {
      if (state.connectedPath.length > 0) {
        state.constellationNodes.forEach(n => n.connected = false);
        state.connectedPath = [];
        renderConstellationSVG();
      }
    }
  }

  function toggleConstellations() {
    state.showConstellations = !state.showConstellations;
    dom.constellationOverlay.classList.toggle('active', state.showConstellations);
    dom.btnToggleConstellations.style.borderColor = state.showConstellations ? '#00f5d4' : '#b8864e';
    dom.btnToggleConstellations.style.boxShadow = state.showConstellations ? '0 0 15px rgba(0,245,212,0.3)' : 'none';
    renderConstellationSVG();
  }

  // =========================================
  // 5. ANIMATION LOOPS
  // =========================================
  function startAnimationLoop() {
    function loop() {
      state.time += 0.01;
      drawStarField();
      drawOceanWaves();
      drawBioluminescentTrail();
      updateCompass();
      state.animFrameId = requestAnimationFrame(loop);
    }
    loop();
  }

  // --- Star Field ---
  function drawStarField() {
    const ctx = dom.starCtx;
    ctx.clearRect(0, 0, state.width, state.height);

    // Calculate parallax offset based on mouse
    const offsetX = (state.mouseX - state.centerX) * 0.02;
    const offsetY = (state.mouseY - state.centerY) * 0.02;

    state.stars.forEach(star => {
      const twinkle = Math.sin(state.time * star.twinkleSpeed * 60 + star.twinkleOffset);
      const alpha = star.baseAlpha + (twinkle * 0.2);
      const drawX = (star.x * state.width) + (offsetX / star.parallaxDepth);
      const drawY = (star.y * state.height) + (offsetY / star.parallaxDepth);

      ctx.beginPath();
      ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.fill();

      // Glow for larger stars
      if (star.size > 1.8) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size * 2.5, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 2.5);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }

  // --- Ocean Waves ---
  function drawOceanWaves() {
    const ctx = dom.waveCtx;
    ctx.clearRect(0, 0, state.width, state.height);

    const waveBaseY = state.height * 0.75;
    
    for (let layer = 0; layer < state.waveLayers; layer++) {
      const layerDepth = layer + 1;
      const amplitude = 20 + (layer * 15);
      const frequency = 0.002 + (layer * 0.0008);
      const speed = state.time * (0.8 + layer * 0.3);
      const yOffset = waveBaseY + (layer * 40);
      const opacity = 0.05 + (layer * 0.03);

      ctx.beginPath();
      ctx.moveTo(0, state.height);
      
      for (let x = 0; x <= state.width; x += 5) {
        const y = yOffset + Math.sin(x * frequency + speed) * amplitude + Math.cos(x * frequency * 0.7 - speed * 0.5) * (amplitude * 0.5);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(state.width, state.height);
      ctx.closePath();
      ctx.fillStyle = `rgba(13, 40, 75, ${opacity})`;
      ctx.fill();
    }
  }

  // --- Bioluminescent Trail ---
  function drawBioluminescentTrail() {
    const ctx = dom.trailCtx;
    ctx.clearRect(0, 0, state.width, state.height);

    // Add new points
    const now = performance.now();
    state.trail.push({ x: state.mouseX, y: state.mouseY, birth: now, life: 1 });

    // Remove old points
    state.trail = state.trail.filter(p => now - p.birth < 800);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < state.trail.length; i++) {
      const p = state.trail[i];
      const age = now - p.birth;
      p.life = 1 - (age / 800);
      
      if (p.life <= 0) continue;

      const radius = 4 + (p.life * 12);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      gradient.addColorStop(0, `rgba(0, 245, 212, ${p.life * 0.8})`);
      gradient.addColorStop(0.4, `rgba(0, 180, 216, ${p.life * 0.4})`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // --- Compass Rotation ---
  function updateCompass() {
    const dx = state.mouseX - state.centerX;
    const dy = state.mouseY - state.centerY;
    state.targetAngle = Math.atan2(dy, dx);
    
    // Smooth interpolation
    state.currentAngle += (state.targetAngle - state.currentAngle) * 0.04;
    
    // Convert to degrees for CSS
    const degrees = state.currentAngle * (180 / Math.PI);
    dom.compass.style.transform = `rotate(${degrees * 0.3}deg) scale(${1 + Math.sin(state.time) * 0.01})`;
  }

  // =========================================
  // 6. INTERACTIONS & UI
  // =========================================
  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    
    // Update tooltip position
    if (dom.tooltip.classList.contains('visible')) {
      dom.tooltip.style.left = `${e.clientX + 15}px`;
      dom.tooltip.style.top = `${e.clientY - 10}px`;
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') resetView();
  }

  function showTooltip(e, island) {
    const name = island.dataset.name || 'Unknown Island';
    const zenith = island.querySelector('.island-zenith')?.textContent || 'Zenith star unknown';
    dom.tooltip.querySelector('.tooltip-title').textContent = name;
    dom.tooltip.querySelector('.tooltip-description').textContent = zenith;
    dom.tooltip.classList.add('visible');
    dom.tooltip.style.left = `${e.clientX + 15}px`;
    dom.tooltip.style.top = `${e.clientY - 10}px`;
  }

  function hideTooltip() {
    dom.tooltip.classList.remove('visible');
  }

  function handleIslandClick(e, island) {
    e.stopPropagation();
    const zenith = island.querySelector('.island-zenith');
    zenith.style.opacity = '1';
    zenith.style.top = '40px';
    setTimeout(() => {
      zenith.style.opacity = '';
      zenith.style.top = '';
    }, 2000);
  }

  function toggleCurrents() {
    state.showCurrents = !state.showCurrents;
    document.getElementById('oceanCurrents').classList.toggle('hidden', !state.showCurrents);
    dom.btnToggleCurrents.style.borderColor = state.showCurrents ? '#00b4d8' : '#b8864e';
  }

  function toggleStarPaths() {
    state.showStarPaths = !state.showStarPaths;
    document.getElementById('starPaths').classList.toggle('hidden', !state.showStarPaths);
    dom.btnToggleStarPaths.style.borderColor = state.showStarPaths ? '#f4d03f' : '#b8864e';
  }

  function resetView() {
    state.connectedPath = [];
    state.constellationNodes.forEach(n => n.connected = false);
    renderConstellationSVG();
    dom.compass.style.transform = 'rotate(0deg)';
    state.currentAngle = 0;
    state.targetAngle = 0;
  }

  // =========================================
  // 7. LOADING SEQUENCE
  // =========================================
  function initLoadingSequence() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress > 100) progress = 100;
      dom.loadingBar.style.width = `${progress}%`;
      
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          dom.loadingScreen.classList.add('fade-out');
          dom.infoPanel.classList.add('open');
          state.isLoaded = true;
          startAnimationLoop();
        }, 400);
      }
    }, 150);
  }

  // Utility: Optional subtle audio feedback placeholder
  function playSound(type) {
    // In a production app, Web Audio API would go here.
    // Visual feedback is handled via CSS transitions.
  }

  // =========================================
  // 8. BOOT
  // =========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
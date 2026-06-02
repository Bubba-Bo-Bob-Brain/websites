// ============================================================
// scripts.js – Ancestral Archive · Sankofa · Digital Museum
// holographic artifacts, griot narration, star map, timeline
// ============================================================

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const sections = document.querySelectorAll('.gallery-section');
  const navBtns = document.querySelectorAll('.symbol-btn');
  const rotBtns = document.querySelectorAll('.rot-btn');
  const artifactSpins = document.querySelectorAll('.artifact-spin');
  const griotText = document.getElementById('griot-text');
  const playBtn = document.getElementById('play-griot');
  const nextBtn = document.getElementById('next-griot');
  const transcriptLines = document.querySelectorAll('.transcript-line');
  const starCanvas = document.getElementById('star-canvas');
  const timelineTrack = document.querySelector('.timeline-track');
  const goldWireCanvas = document.getElementById('gold-wire-canvas');

  // ---------- ADINKRA NAVIGATION ----------
  function activateSection(sectionId) {
    sections.forEach((sec) => {
      sec.classList.remove('active-section');
      if (sec.id === sectionId) sec.classList.add('active-section');
    });
    navBtns.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.section === sectionId) btn.classList.add('active');
    });
  }

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      if (target) activateSection(target);
    });
  });

  // activate home by default
  activateSection('home');

  // ---------- HOLOGRAPHIC ARTIFACT ROTATION ----------
  rotBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.artifact-card');
      if (!card) return;
      const spin = card.querySelector('.artifact-spin');
      if (!spin) return;
      let current = parseInt(spin.dataset.rotation, 10) || 0;
      const dir = btn.dataset.dir;
      const step = 30;
      if (dir === 'left') current -= step;
      else current += step;
      spin.dataset.rotation = current;
      spin.style.transform = `rotateY(${current}deg)`;
    });
  });

  // ---------- GRIOT NARRATION (oral history) ----------
  const griotLines = [
    'Listen: the first drum was a hollowed baobab.',
    'The second drum was the chest of a king.',
    'And the third drum is your own heartbeat.',
    'The ancestors speak through the roots of the silk-cotton tree.',
    'We carry the star dust of those who walked before.',
  ];

  let griotIndex = 0;
  let griotInterval = null;

  function updateGriot(index) {
    griotIndex = index % griotLines.length;
    if (griotText) {
      griotText.textContent = griotLines[griotIndex];
      griotText.style.opacity = 0;
      requestAnimationFrame(() => { griotText.style.opacity = 1; });
    }
    // highlight transcript
    transcriptLines.forEach((line, i) => {
      line.classList.toggle('active', i === griotIndex);
    });
  }

  function playGriot() {
    if (griotInterval) {
      clearInterval(griotInterval);
      griotInterval = null;
      if (playBtn) playBtn.textContent = '▶ play';
      return;
    }
    griotInterval = setInterval(() => {
      updateGriot(griotIndex + 1);
    }, 5000);
    if (playBtn) playBtn.textContent = '⏸ pause';
  }

  function nextGriot() {
    if (griotInterval) {
      clearInterval(griotInterval);
      griotInterval = null;
      if (playBtn) playBtn.textContent = '▶ play';
    }
    updateGriot(griotIndex + 1);
  }

  if (playBtn) playBtn.addEventListener('click', playGriot);
  if (nextBtn) nextBtn.addEventListener('click', nextGriot);
  // initial
  updateGriot(0);

  // ---------- COSMIC STAR MAP (canvas) ----------
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    let width = starCanvas.width;
    let height = starCanvas.height;

    function resizeStarCanvas() {
      const rect = starCanvas.getBoundingClientRect();
      starCanvas.width = rect.width * window.devicePixelRatio;
      starCanvas.height = rect.height * window.devicePixelRatio;
      width = starCanvas.width;
      height = starCanvas.height;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawStars();
    }

    // star data
    const stars = [];
    const diasporaPaths = [];

    function initStars() {
      stars.length = 0;
      diasporaPaths.length = 0;
      // ancestral stars (gold)
      for (let i = 0; i < 60; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2.5 + 1.5,
          type: 'ancestral',
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      // diaspora path stars (blue)
      for (let i = 0; i < 40; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          type: 'diaspora',
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      // future stars (white)
      for (let i = 0; i < 30; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.8,
          type: 'future',
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      // diaspora connecting lines
      for (let i = 0; i < 12; i++) {
        const a = stars[Math.floor(Math.random() * stars.length)];
        const b = stars[Math.floor(Math.random() * stars.length)];
        if (a && b) diasporaPaths.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() / 2000;

      // draw diaspora paths
      ctx.strokeStyle = 'rgba(74, 124, 247, 0.12)';
      ctx.lineWidth = 0.8;
      diasporaPaths.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.stroke();
      });

      // draw stars
      stars.forEach((star) => {
        const pulse = Math.sin(time + star.pulse) * 0.3 + 0.7;
        const r = star.r * pulse;
        let color;
        if (star.type === 'ancestral') color = `rgba(212, 175, 55, ${0.7 + pulse * 0.3})`;
        else if (star.type === 'diaspora') color = `rgba(74, 124, 247, ${0.6 + pulse * 0.3})`;
        else color = `rgba(224, 224, 255, ${0.5 + pulse * 0.3})`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // glow
        ctx.shadowColor = star.type === 'ancestral' ? '#d4af37' : star.type === 'diaspora' ? '#4a7cf7' : '#e0e0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function animateStars() {
      const time = Date.now() / 2000;
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      });
      drawStars();
      requestAnimationFrame(animateStars);
    }

    resizeStarCanvas();
    initStars();
    animateStars();

    window.addEventListener('resize', resizeStarCanvas);
  }

  // ---------- TIMELINE DRAG SCROLL ----------
  if (timelineTrack) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    timelineTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - timelineTrack.offsetLeft;
      scrollLeft = timelineTrack.scrollLeft;
      timelineTrack.style.cursor = 'grabbing';
    });

    timelineTrack.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - timelineTrack.offsetLeft;
      const walk = (x - startX) * 1.2;
      timelineTrack.scrollLeft = scrollLeft - walk;
    });

    const stopDrag = () => {
      isDragging = false;
      timelineTrack.style.cursor = 'grab';
    };
    timelineTrack.addEventListener('mouseup', stopDrag);
    timelineTrack.addEventListener('mouseleave', stopDrag);
  }

  // ---------- GOLD WIRE CANVAS (ambient particles) ----------
  if (goldWireCanvas) {
    const gCtx = goldWireCanvas.getContext('2d');
    let gW, gH;
    const particles = [];

    function resizeGoldCanvas() {
      gW = window.innerWidth;
      gH = window.innerHeight;
      goldWireCanvas.width = gW;
      goldWireCanvas.height = gH;
    }

    function initParticles(count = 60) {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * gW,
          y: Math.random() * gH,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function drawGoldParticles() {
      gCtx.clearRect(0, 0, gW, gH);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = gW;
        if (p.x > gW) p.x = 0;
        if (p.y < 0) p.y = gH;
        if (p.y > gH) p.y = 0;

        gCtx.beginPath();
        gCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        gCtx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        gCtx.fill();
      });

      // draw fine connecting lines
      gCtx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
      gCtx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 3) {
        const a = particles[i];
        const b = particles[(i + 7) % particles.length];
        if (a && b) {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            gCtx.beginPath();
            gCtx.moveTo(a.x, a.y);
            gCtx.lineTo(b.x, b.y);
            gCtx.stroke();
          }
        }
      }

      requestAnimationFrame(drawGoldParticles);
    }

    resizeGoldCanvas();
    initParticles(70);
    drawGoldParticles();
    window.addEventListener('resize', () => {
      resizeGoldCanvas();
      initParticles(70);
    });
  }

  // ---------- HERO HOVER / ENTER BUTTON ----------
  const enterBtn = document.querySelector('[data-action="enter-archive"]');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      const holoSection = document.getElementById('hologlyphs');
      if (holoSection) {
        activateSection('hologlyphs');
        holoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ---------- keyboard accessibility: nav with numbers ----------
  document.addEventListener('keydown', (e) => {
    const key = parseInt(e.key, 10);
    if (key >= 1 && key <= 5) {
      const targets = ['home', 'hologlyphs', 'oral-history', 'cosmic-map', 'timeline'];
      const id = targets[key - 1];
      if (id) activateSection(id);
    }
  });

})();
/* ============================================================
   MAGNVM OPVS — Laboratorium Alchemicum Interactivum
   scripts.js
   The animating spirit of the Great Work
   ============================================================ */

(function() {
  'use strict';

  // ==========================================================
  // 1. STATE — The Alchemical Progress
  // ==========================================================
  const STAGES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
  const STAGE_COLORS = {
    nigredo: { css: '#1a0f0a', glow: 'rgba(26, 15, 10, 0.4)', name: 'Nigredo' },
    albedo: { css: '#d9d0c4', glow: 'rgba(217, 208, 196, 0.4)', name: 'Albedo' },
    citrinitas: { css: '#d4a853', glow: 'rgba(212, 168, 83, 0.4)', name: 'Citrinitas' },
    rubedo: { css: '#8b1a1a', glow: 'rgba(139, 26, 26, 0.4)', name: 'Rubedo' }
  };

  let currentStageIndex = 0;
  let progressValue = 0; // 0–100
  let isCelestialActive = false;
  let celestialAnimationId = null;

  // DOM references
  const root = document.documentElement;
  const stageLabels = document.querySelectorAll('.stage-label');
  const progressFill = document.querySelector('.stage-progress-fill');
  const philosopherStone = document.querySelector('.philosopher-stone');
  const crucibleLiquid = document.getElementById('crucibleLiquid');
  const manuscriptTexts = document.querySelectorAll('.manuscript-text');
  const celestialCanvas = document.getElementById('celestialCanvas');
  const celestialToggle = document.getElementById('celestialToggle');
  const mortarContainer = document.getElementById('mortarContainer');
  const pestle = document.getElementById('pestle');
  const ingredientParticles = document.querySelectorAll('.ingredient-particle');
  const elementButtons = document.querySelectorAll('.element-btn');
  const bubbleElements = document.querySelectorAll('.bubble');

  // ==========================================================
  // 2. STAGE MANAGEMENT — Progress Through the Great Work
  // ==========================================================
  function updateStage(index) {
    const stage = STAGES[index];
    const colors = STAGE_COLORS[stage];

    // Update CSS variables
    root.style.setProperty('--stage-accent', colors.css);
    root.style.setProperty('--stage-accent-glow', colors.glow);

    // Update stage labels
    stageLabels.forEach((label, i) => {
      label.setAttribute('aria-current', i === index ? 'true' : 'false');
    });

    // Update progress bar
    const progressPercent = ((index) / (STAGES.length - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Update philosopher stone color
    philosopherStone.setAttribute('fill', colors.css);

    // Update crucible liquid
    crucibleLiquid.style.background = `radial-gradient(ellipse at bottom, ${colors.css} 0%, transparent 80%)`;
    crucibleLiquid.style.opacity = 0.3 + (index * 0.15);

    // Reveal manuscript texts progressively
    manuscriptTexts.forEach((text, i) => {
      if (i <= index) {
        text.classList.add('revealed');
      } else {
        text.classList.remove('revealed');
      }
    });

    // Update document title to reflect stage
    document.title = `MAGNVM OPVS — ${colors.name}`;

    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('stagechange', { detail: { stage, index } }));
  }

  function advanceStage() {
    if (currentStageIndex < STAGES.length - 1) {
      currentStageIndex++;
      updateStage(currentStageIndex);
    }
  }

  // ==========================================================
  // 3. TRANSMUTATION CIRCLE — Rotation & Interaction
  // ==========================================================
  const circleContainer = document.querySelector('.transmutation-circle-container');
  const planetaryGroup = document.querySelector('.planetary-symbols');
  let circleRotation = 0;
  let circleTargetRotation = 0;
  let isCircleHovered = false;

  // Slow automatic rotation
  function updateCircleRotation() {
    if (!isCircleHovered) {
      circleRotation += 0.008;
    } else {
      // Speed up on hover
      circleRotation += 0.05;
    }
    planetaryGroup.setAttribute('transform', `rotate(${circleRotation}, 300, 300)`);
    requestAnimationFrame(updateCircleRotation);
  }

  circleContainer.addEventListener('mouseenter', () => {
    isCircleHovered = true;
  });

  circleContainer.addEventListener('mouseleave', () => {
    isCircleHovered = false;
  });

  // Click on circle advances stage
  circleContainer.addEventListener('click', () => {
    advanceStage();
    // Brief visual pulse
    philosopherStone.style.animation = 'none';
    philosopherStone.offsetHeight; // trigger reflow
    philosopherStone.style.animation = 'stonePulse 0.6s ease-in-out';
  });

  // ==========================================================
  // 4. ELEMENT BUTTONS — Adding to the Crucible
  // ==========================================================
  elementButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const element = this.dataset.element;
      
      // Visual feedback: liquid intensifies briefly
      crucibleLiquid.style.transition = 'opacity 0.15s ease';
      crucibleLiquid.style.opacity = '0.8';
      setTimeout(() => {
        crucibleLiquid.style.opacity = '0.5';
      }, 300);

      // Trigger extra bubbles
      bubbleElements.forEach(bubble => {
        bubble.style.animation = 'none';
        bubble.offsetHeight;
        bubble.style.animation = `bubbleRise ${1 + Math.random()}s ease-in-out`;
      });

      // Advance stage slightly on element addition (every 3 clicks)
      const clickCount = parseInt(this.dataset.clicks || '0') + 1;
      this.dataset.clicks = clickCount;
      if (clickCount % 3 === 0) {
        advanceStage();
      }

      // Play subtle sound via oscillator (optional ambient)
      playAlchemicalTone(element);
    });
  });

  // ==========================================================
  // 5. ALCHEMICAL TONES — Subtle Audio Feedback
  // ==========================================================
  function playAlchemicalTone(element) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Different frequencies for different elements
      const frequencies = {
        sulphur: 220,
        mercury: 330,
        salt: 275,
        phlegm: 195
      };
      
      oscillator.frequency.value = frequencies[element] || 260;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch(e) {
      // Silently fail if audio not supported
    }
  }

  // ==========================================================
  // 6. MORTAR & PESTLE — Grinding Interaction
  // ==========================================================
  let mortarClickCount = 0;

  mortarContainer.addEventListener('click', function() {
    mortarClickCount++;
    
    // Animate pestle
    pestle.style.transition = 'transform 0.1s ease';
    pestle.style.transform = 'translateX(-50%) rotate(10deg)';
    setTimeout(() => {
      pestle.style.transform = 'translateX(-50%) rotate(-10deg)';
    }, 100);
    setTimeout(() => {
      pestle.style.transform = 'translateX(-50%) rotate(0deg)';
    }, 200);

    // Animate particles scattering
    ingredientParticles.forEach((particle, i) => {
      const delay = i * 0.05;
      setTimeout(() => {
        particle.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * -8}px) rotate(${Math.random() * 30}deg)`;
      }, delay * 1000);
      setTimeout(() => {
        particle.style.transform = 'translate(0, 0) rotate(0deg)';
      }, 300 + delay * 1000);
    });

    // Every 5 clicks, advance stage
    if (mortarClickCount % 5 === 0) {
      advanceStage();
    }
  });

  // ==========================================================
  // 7. MANUSCRIPT SCROLL REVEAL
  // ==========================================================
  function revealManuscriptOnScroll() {
    const manuscriptPage = document.getElementById('manuscriptPage');
    const rect = manuscriptPage.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // When the manuscript enters the viewport, reveal texts progressively
    if (rect.top < windowHeight * 0.75 && rect.bottom > 0) {
      const revealProgress = Math.min(1, (windowHeight * 0.75 - rect.top) / (windowHeight * 0.5));
      const textCount = manuscriptTexts.length;
      const revealIndex = Math.floor(revealProgress * textCount);
      
      manuscriptTexts.forEach((text, i) => {
        if (i <= revealIndex && i <= currentStageIndex) {
          text.classList.add('revealed');
        }
      });
    }
  }

  window.addEventListener('scroll', revealManuscriptOnScroll);

  // ==========================================================
  // 8. CELESTIAL DIAGRAM OVERLAY
  // ==========================================================
  const ctx = celestialCanvas.getContext('2d');
  let stars = [];
  let zodiacLines = [];

  function initCelestialCanvas() {
    celestialCanvas.width = window.innerWidth;
    celestialCanvas.height = window.innerHeight;
    
    // Generate stars
    stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * celestialCanvas.width,
        y: Math.random() * celestialCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.0003 + 0.0001
      });
    }

    // Generate zodiac-like connecting lines
    zodiacLines = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = Math.min(celestialCanvas.width, celestialCanvas.height) * 0.35;
      const cx = celestialCanvas.width / 2;
      const cy = celestialCanvas.height / 2;
      zodiacLines.push({
        x1: cx + Math.cos(angle) * radius * 0.8,
        y1: cy + Math.sin(angle) * radius * 0.8,
        x2: cx + Math.cos(angle + 0.2) * radius,
        y2: cy + Math.sin(angle + 0.2) * radius
      });
    }
  }

  function drawCelestial(time) {
    if (!isCelestialActive) return;

    ctx.clearRect(0, 0, celestialCanvas.width, celestialCanvas.height);
    
    // Draw zodiac circle
    const cx = celestialCanvas.width / 2;
    const cy = celestialCanvas.height / 2;
    const radius = Math.min(celestialCanvas.width, celestialCanvas.height) * 0.35;
    
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw zodiac lines
    zodiacLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = 'rgba(212, 168, 83, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw stars with twinkling
    stars.forEach(star => {
      const twinkle = Math.sin(time * star.speed * 1000 + star.x) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 168, 83, ${star.opacity * twinkle})`;
      ctx.fill();
    });

    celestialAnimationId = requestAnimationFrame(drawCelestial);
  }

  celestialToggle.addEventListener('click', function() {
    isCelestialActive = !isCelestialActive;
    this.classList.toggle('active');
    
    if (isCelestialActive) {
      celestialCanvas.style.opacity = '0.6';
      drawCelestial(0);
    } else {
      celestialCanvas.style.opacity = '0.3';
      if (celestialAnimationId) {
        cancelAnimationFrame(celestialAnimationId);
        celestialAnimationId = null;
      }
      ctx.clearRect(0, 0, celestialCanvas.width, celestialCanvas.height);
    }
  });

  window.addEventListener('resize', () => {
    initCelestialCanvas();
  });

  // ==========================================================
  // 9. AMBIENT BUBBLE GENERATION
  // ==========================================================
  function createAmbientBubble() {
    const vessel = document.querySelector('.crucible-vessel');
    if (!vessel) return;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${Math.random() * 70 + 15}%`;
    bubble.style.animationDuration = `${2 + Math.random() * 2}s`;
    bubble.style.animationDelay = '0s';
    bubble.style.width = `${4 + Math.random() * 6}px`;
    bubble.style.height = bubble.style.width;
    vessel.appendChild(bubble);

    // Remove bubble after animation
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, 4000);
  }

  setInterval(createAmbientBubble, 3000);

  // ==========================================================
  // 10. INITIALIZATION — Begin the Great Work
  // ==========================================================
  function init() {
    // Set initial stage
    updateStage(0);

    // Start circle rotation
    updateCircleRotation();

    // Initialize celestial canvas
    initCelestialCanvas();

    // Reveal first manuscript text immediately
    if (manuscriptTexts.length > 0) {
      manuscriptTexts[0].classList.add('revealed');
    }

    // Log the beginning
    console.log('%c🧪 MAGNVM OPVS — Laboratorium Alchemicum Interactivum', 'font-size: 16px; color: #d4a853;');
    console.log('%cOpus continuatur in aeternum...', 'font-style: italic; color: #9ba4b5;');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
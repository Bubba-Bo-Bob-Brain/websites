(function() {
  'use strict';

  // =====================
  // 1. CLOCK & DATE
  // =====================
  function updateClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if (!clockEl || !dateEl) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = hours + ':' + minutes;

    // Soviet-future date: day. month roman. year 2984
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.getMonth();
    const romanMonths = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    const year = 2984;
    dateEl.textContent = day + '.' + romanMonths[month] + '.' + year;
  }

  updateClock();
  setInterval(updateClock, 10000);

  // =====================
  // 2. NEWS TICKER (duplicate for seamless loop)
  // =====================
  function initTicker() {
    const ticker = document.getElementById('news-ticker');
    if (!ticker) return;

    // Get all original ticker items
    const items = ticker.querySelectorAll('.ticker-item');
    if (items.length === 0) return;

    // Clone items for seamless infinite scroll
    const cloneContainer = document.createElement('div');
    cloneContainer.className = 'ticker-track';
    cloneContainer.style.display = 'flex';
    cloneContainer.style.whiteSpace = 'nowrap';
    cloneContainer.style.animation = 'ticker-scroll 40s linear infinite';

    // Add original items twice
    for (let repeat = 0; repeat < 2; repeat++) {
      items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.style.marginRight = '3rem';
        cloneContainer.appendChild(clone);
      });
    }

    // Clear and append
    ticker.innerHTML = '';
    ticker.style.overflow = 'hidden';
    ticker.appendChild(cloneContainer);
  }

  initTicker();

  // =====================
  // 3. FIVE-YEAR PLAN PROGRESS ANIMATION
  // =====================
  function animateProgress() {
    const progressFill = document.getElementById('progress-fill');
    if (!progressFill) return;

    // Start at 0, animate to 100% over 2 seconds
    progressFill.style.width = '0%';

    // Use requestAnimationFrame for smooth animation
    let start = null;
    const duration = 2000; // ms
    const targetPercent = 100;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentPercent = eased * targetPercent;
      progressFill.style.width = currentPercent + '%';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Add a subtle glow pulse after completion
        progressFill.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
      }
    }

    requestAnimationFrame(step);
  }

  // Run after a short delay for page load
  setTimeout(animateProgress, 500);

  // =====================
  // 4. GLITCH EFFECT ON HERO TITLE (on hover)
  // =====================
  function initGlitch() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Add glitch class on hover
    heroTitle.addEventListener('mouseenter', function() {
      this.classList.add('glitch');
      this.dataset.text = this.textContent;
    });

    heroTitle.addEventListener('mouseleave', function() {
      this.classList.remove('glitch');
    });
  }

  initGlitch();

  // =====================
  // 5. STATIC OVERLAY FLICKER (subtle)
  // =====================
  function initStaticOverlay() {
    const staticEl = document.getElementById('static-overlay');
    if (!staticEl) return;

    // Create a canvas for static noise
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 60;
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;opacity:0.03;mix-blend-mode:overlay;';

    function drawStatic() {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i+1] = value;   // G
        data[i+2] = value;   // B
        data[i+3] = 30;      // A (very subtle)
      }
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(drawStatic);
    }

    drawStatic();
    document.body.appendChild(canvas);
  }

  initStaticOverlay();

  // =====================
  // 6. KEYBOARD EASTER EGG: press 'P' for propaganda blast
  // =====================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'p' || e.key === 'P') {
      // Flash screen red for a moment
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(179,27,27,0.3);pointer-events:none;z-index:10000;transition:opacity 0.3s;';
      document.body.appendChild(flash);

      setTimeout(function() {
        flash.style.opacity = '0';
        setTimeout(function() {
          flash.remove();
        }, 300);
      }, 150);
    }
  });

  // =====================
  // 7. CONSTRUCTIVIST GEOMETRIC DECORATIONS (CSS-only, but add a subtle JS touch)
  // =====================
  function addGeometricDecor() {
    const hero = document.getElementById('hero-section');
    if (!hero) return;

    // Create a few decorative diagonal lines
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      const isLeft = i % 2 === 0;
      const topPos = 20 + (i * 15);
      line.style.cssText = `
        position: absolute;
        top: ${topPos}%;
        ${isLeft ? 'left' : 'right'}: -5%;
        width: 30%;
        height: 2px;
        background: rgba(179, 27, 27, 0.15);
        transform: rotate(${isLeft ? 25 : -25}deg);
        pointer-events: none;
        z-index: 1;
      `;
      hero.appendChild(line);
    }
  }

  addGeometricDecor();

  // =====================
  // 8. COSMONAUT MOTIF: random floating particles (stars)
  // =====================
  function createParticles() {
    const container = document.getElementById('screen-frame');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 4;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 215, 0, 0.4);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        z-index: 0;
        animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
      `;
      container.appendChild(particle);
    }
  }

  // Inject keyframe for particles if not already present
  function ensureParticleKeyframes() {
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  ensureParticleKeyframes();
  createParticles();

})();
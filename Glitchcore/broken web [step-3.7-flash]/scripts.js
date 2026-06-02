document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor-trail');
  const interactiveElements = document.querySelectorAll('a, button, .hidden-trigger, .secret-gateway, .restart-link');
  const layers = document.querySelectorAll('.layer');
  const links = document.querySelectorAll('[data-target]');
  const transitionOverlay = document.getElementById('transition-overlay');
  const glitchFlash = document.getElementById('glitch-flash');
  let isTransitioning = false;

  // Custom cursor trail style
  const trailStyle = document.createElement('style');
  trailStyle.textContent = `
    .cursor-trail-dot {
      position: fixed;
      width: 4px;
      height: 4px;
      background: #33ff00;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
      transition: opacity 0.3s ease, transform 0.3s ease;
      mix-blend-mode: difference;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .fake-error {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff0033;
      color: white;
      padding: 2rem;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.8rem;
      z-index: 10000;
      text-align: center;
      animation: fadeOut 2s forwards;
      animation-delay: 1s;
    }
    @keyframes fadeOut {
      to { opacity: 0; visibility: hidden; }
    }
    .custom-context-menu {
      position: fixed;
      background: #111;
      border: 1px solid #33ff00;
      padding: 0.5rem 0;
      z-index: 10002;
      display: none;
      min-width: 200px;
      box-shadow: 0 0 20px rgba(51,255,0,0.2);
    }
    .context-item {
      padding: 0.5rem 1rem;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.8rem;
      color: #33ff00;
      cursor: pointer;
      transition: background 0.2s;
    }
    .context-item:hover {
      background: rgba(51,255,0,0.1);
    }
  `;
  document.head.appendChild(trailStyle);

  // Custom cursor movement and trail
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - 10}px`;
    cursor.style.top = `${e.clientY - 10}px`;

    const trail = document.createElement('div');
    trail.classList.add('cursor-trail-dot');
    document.body.appendChild(trail);
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;

    setTimeout(() => {
      trail.style.opacity = '0';
      trail.style.transform = 'scale(0)';
    }, 10);
    setTimeout(() => trail.remove(), 300);
  });

  // Cursor hover effects for interactive elements
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = '#ff0033';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.borderColor = '#33ff00';
    });
  });

  // Layer navigation with glitch transitions
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      isTransitioning = true;

      const targetId = link.dataset.target;
      const targetLayer = document.getElementById(targetId);
      if (!targetLayer) return;

      transitionOverlay.classList.add('active');
      glitchFlash.style.opacity = '0.8';
      setTimeout(() => glitchFlash.style.opacity = '0', 100);
      document.body.style.animation = 'shake 0.3s ease';
      setTimeout(() => document.body.style.animation = '', 300);

      setTimeout(() => {
        layers.forEach(layer => layer.classList.remove('active'));
        targetLayer.classList.add('active');
        transitionOverlay.classList.remove('active');

        const shuffleTexts = targetLayer.querySelectorAll('.shuffle-text');
        shuffleTexts.forEach(scrambleText);

        isTransitioning = false;
      }, 500);
    });
  });

  // Text scramble effect
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
  function scrambleText(element) {
    const originalText = element.dataset.original;
    let iterations = 0;
    const maxIterations = originalText.length;
    
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      iterations += 1/3;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        element.textContent = originalText;
      }
    }, 30);
  }

  // Initial scramble for homepage
  const initialShuffleTexts = document.querySelectorAll('#layer-0 .shuffle-text');
  initialShuffleTexts.forEach(scrambleText);

  // Eternal loading bar (never finishes)
  const eternalLoader = document.getElementById('eternal-loader');
  const loadingPercent = document.getElementById('loading-percent');
  let loadProgress = 0;

  function updateLoader() {
    const increment = Math.random() * 2;
    loadProgress += Math.random() > 0.7 ? -Math.random() * 3 : increment;
    loadProgress = Math.max(0, Math.min(loadProgress, 99));
    
    if (Math.random() > 0.9) {
      loadProgress = Math.floor(loadProgress);
    } else {
      loadProgress = Math.floor(loadProgress * 10) / 10;
    }

    eternalLoader.style.width = `${loadProgress}%`;
    loadingPercent.textContent = `${Math.floor(loadProgress)}%`;

    if (Math.random() > 0.8) {
      loadingPercent.textContent = `${Math.floor(Math.random() * 100)}%`;
    }
  }
  setInterval(updateLoader, 200);

  // Random glitch events
  function triggerRandomGlitch() {
    const glitchType = Math.floor(Math.random() * 3);
    switch(glitchType) {
      case 0:
        glitchFlash.style.opacity = '0.5';
        setTimeout(() => glitchFlash.style.opacity = '0', 50);
        break;
      case 1:
        const randomTexts = document.querySelectorAll('.glitch-text, .error-title, .terminal-line');
        const randomEl = randomTexts[Math.floor(Math.random() * randomTexts.length)];
        randomEl.style.animation = 'none';
        randomEl.offsetHeight;
        randomEl.style.animation = 'glitch-text 0.2s infinite';
        setTimeout(() => randomEl.style.animation = '', 500);
        break;
      case 2:
        cursor.style.opacity = '0.5';
        setTimeout(() => cursor.style.opacity = '1', 100);
        break;
    }
    setTimeout(triggerRandomGlitch, Math.random() * 10000 + 5000);
  }
  setTimeout(triggerRandomGlitch, 3000);

  // Web 1.0 visitor counter
  const web1Counter = document.querySelector('.counter-digits');
  let counterValue = 12345;

  function updateCounter() {
    counterValue += Math.random() > 0.3 ? 1 : Math.floor(Math.random() * 5);
    web1Counter.textContent = counterValue.toString().padStart(6, '0');
  }

  function scheduleCounterUpdate() {
    setTimeout(() => {
      updateCounter();
      scheduleCounterUpdate();
    }, Math.random() * 8000 + 2000);
  }
  scheduleCounterUpdate();

  // BSOD error info progress
  const bsodPercent = document.querySelector('.qr-text');
  let bsodProgress = 0;

  setInterval(() => {
    bsodProgress += Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 1;
    if (bsodProgress > 100) bsodProgress = 0;
    bsodPercent.textContent = `Collecting error info... ${bsodProgress}%`;
  }, 500);

  // Hidden secret trigger interaction
  const secretTrigger = document.getElementById('secret-trigger');
  secretTrigger.addEventListener('click', () => {
    document.body.style.animation = 'shake 0.5s ease';
    setTimeout(() => document.body.style.animation = '', 500);
    glitchFlash.style.opacity = '1';
    setTimeout(() => glitchFlash.style.opacity = '0', 200);

    const fakeError = document.createElement('div');
    fakeError.classList.add('fake-error');
    fakeError.textContent = 'ERR_ACCESS_DENIED: classified memory fragment corrupted';
    document.body.appendChild(fakeError);

    setTimeout(() => fakeError.remove(), 3000);
  });

  // Custom context menu
  const contextMenu = document.createElement('div');
  contextMenu.classList.add('custom-context-menu');
  contextMenu.innerHTML = `
    <div class="context-item">📋 Copy Error</div>
    <div class="context-item">🔍 Inspect Corruption</div>
    <div class="context-item">🗑️ Delete Memory Fragment</div>
    <div class="context-item">⚠️ Report System Failure</div>
  `;
  document.body.appendChild(contextMenu);

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
  });

  document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
  });

  document.querySelectorAll('.context-item').forEach(item => {
    item.addEventListener('click', () => {
      glitchFlash.style.opacity = '0.8';
      setTimeout(() => glitchFlash.style.opacity = '0', 100);
      contextMenu.style.display = 'none';
    });
  });

  // Randomize floating debris positions
  const debris = document.querySelectorAll('.debris');
  debris.forEach(d => {
    d.style.left = `${Math.random() * 90 + 5}%`;
    d.style.animationDelay = `${Math.random() * 10}s`;
    d.style.animationDuration = `${Math.random() * 10 + 5}s`;
  });

  // Random corrupted image glitches
  const halfImages = document.querySelectorAll('.half-image');
  function glitchImages() {
    halfImages.forEach(img => {
      if (Math.random() > 0.7) {
        img.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        setTimeout(() => img.style.transform = '', 100);
      }
    });
    setTimeout(glitchImages, Math.random() * 5000 + 2000);
  }
  glitchImages();
});
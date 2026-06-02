/**
 * GLAVKOSMOS STATE BROADCAST TERMINAL
 * Soviet Retrofuturist Propaganda - JavaScript Controller
 * Handles: Clock, News Ticker, Progress Bars, CRT Noise, Glitch Effects
 */
(function() {
  'use strict';

  // Cache DOM elements
  const dom = {
    clockTime: document.getElementById('clockTime'),
    clockDate: document.getElementById('clockDate'),
    newsTicker: document.getElementById('newsTicker'),
    noiseOverlay: document.getElementById('noiseOverlay'),
    planItems: document.querySelectorAll('.plan-item'),
    heroHeadline: document.querySelector('.hero-headline'),
    cards: document.querySelectorAll('.dispatch-card'),
    broadcastContent: document.querySelector('.broadcast-content')
  };

  // Data: State-Approved Headlines
  const headlines = [
    "COSMONAUT VOLKOV RETURNS FROM 3-YEAR ORBITAL MISSION ★",
    "LUNAR COLONY 'ЛУНАГРАД' REACHES 5,000 PERMANENT RESIDENTS ★",
    "RECORD GRAIN HARVEST REPORTED FROM VENUSIAN GREENHOUSES ★",
    "SUPREME SOVIET APPROVES FUNDING FOR MARS COLONIZATION INITIATIVE ★",
    "TITANIUM PRODUCTION AT URAL ORBITAL FOUNDRY EXCEEDS QUOTA BY 142% ★",
    "NEW INTERPLANETARY CRUISER 'RED OCTOBER-CLASS' LAUNCHED FROM BAIKONUR ★",
    "COMRADE-ENGINEER PETROV AWARDED ORDER OF LENIN FOR REACTOR INNOVATION ★",
    "SOLAR ARRAY OUTPUT REACHES 127% OF FIVE-YEAR PLAN TARGET ★",
    "BOLSHOI BALLET TO PERFORM ZERO-GRAVITY SYMPHONY NEXT TUESDAY ★",
    "STATE MEDIA REPORTS SUCCESSFUL TEST OF PLASMA PROPULSION DRIVE ★",
    "PROLETARIAN COLLECTIVE ON GANYMEDE ACHIEVES ENERGY SELF-SUFFICIENCY ★",
    "DIRECTIVE 88-B: ALL CITIZENS TO REPORT FOR COSMIC APTITUDE TESTING ★"
  ];

  /* =========================================
     1. MOSCOW STANDARD TIME
     ========================================= */
  function initClock() {
    const months = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    
    function update() {
      const now = new Date();
      const moscow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
      
      // Time
      const h = String(moscow.getHours()).padStart(2, '0');
      const m = String(moscow.getMinutes()).padStart(2, '0');
      const s = String(moscow.getSeconds()).padStart(2, '0');
      dom.clockTime.textContent = `${h}:${m}:${s}`;
      
      // Date
      const d = String(moscow.getDate()).padStart(2, '0');
      const mo = months[moscow.getMonth()];
      const y = moscow.getFullYear();
      dom.clockDate.textContent = `${d}.${mo}.${y}`;
    }
    
    update();
    setInterval(update, 1000);
  }

  /* =========================================
     2. INFINITE SCROLLING NEWS TICKER
     ========================================= */
  function initTicker() {
    if (!dom.newsTicker) return;
    
    // Create ticker items
    const items = headlines.map(text => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.textContent = text;
      return el;
    });
    
    // Duplicate for seamless CSS loop
    const fragment = document.createDocumentFragment();
    [...items, ...items].forEach(item => fragment.appendChild(item.cloneNode(true)));
    dom.newsTicker.appendChild(fragment);
    
    // Pause on hover
    const tickerSection = dom.newsTicker.closest('.news-ticker-section');
    if (tickerSection) {
      tickerSection.addEventListener('mouseenter', () => {
        dom.newsTicker.style.animationPlayState = 'paused';
      });
      tickerSection.addEventListener('mouseleave', () => {
        dom.newsTicker.style.animationPlayState = 'running';
      });
    }
  }

  /* =========================================
     3. FIVE-YEAR PLAN PROGRESS BARS
     ========================================= */
  function initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const progress = item.dataset.progress || 0;
          const fill = item.querySelector('.plan-bar-fill');
          const percent = item.querySelector('.plan-bar-percent');
          
          if (fill && percent) {
            // Trigger CSS transition
            requestAnimationFrame(() => {
              fill.style.width = `${progress}%`;
              
              // Animate number counting
              let current = 0;
              const step = Math.max(1, Math.floor(progress / 30));
              const interval = setInterval(() => {
                current += step;
                if (current >= progress) {
                  current = progress;
                  clearInterval(interval);
                }
                percent.textContent = `${current}%`;
              }, 30);
            });
          }
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.2 });

    dom.planItems.forEach(item => observer.observe(item));
  }

  /* =========================================
     4. CRT STATIC NOISE (Canvas)
     ========================================= */
  function initCRTNoise() {
    if (!dom.noiseOverlay) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'cover';
    canvas.style.opacity = '0.06';
    canvas.style.pointerEvents = 'none';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    dom.noiseOverlay.innerHTML = '';
    dom.noiseOverlay.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', { alpha: false });
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = imageData.data;
    
    function render() {
      for (let i = 0; i < buffer.length; i += 4) {
        const val = Math.random() * 255;
        buffer[i] = val;     // R
        buffer[i+1] = val;   // G
        buffer[i+2] = val;   // B
        buffer[i+3] = 255;   // A
      }
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(render);
    }
    
    // Start noise loop
    render();
  }

  /* =========================================
     5. TRANSMISSION GLITCH EFFECTS
     ========================================= */
  function initGlitchEffects() {
    if (!dom.heroHeadline) return;
    
    // Random glitch interval (3s to 12s)
    function scheduleGlitch() {
      const delay = 3000 + Math.random() * 9000;
      setTimeout(triggerGlitch, delay);
    }
    
    function triggerGlitch() {
      const el = dom.heroHeadline;
      const originalTransform = el.style.transform;
      
      // Apply random distortion
      const skew = (Math.random() - 0.5) * 8;
      const translate = (Math.random() - 0.5) * 4;
      const hue = Math.random() > 0.5 ? 'hue-rotate(90deg)' : 'none';
      
      el.style.transition = 'transform 0.05s steps(2), filter 0.05s steps(1)';
      el.style.transform = `${originalTransform || 'skewX(-3deg)'} skewX(${skew}deg) translateX(${translate}px)`;
      el.style.filter = `${hue} brightness(1.2)`;
      el.style.textShadow = `
        ${-translate}px 0 rgba(196, 30, 58, 0.8), 
        ${translate}px 0 rgba(0, 255, 255, 0.5)
      `;
      
      // Reset quickly
      setTimeout(() => {
        el.style.transition = 'transform 0.2s ease-out, filter 0.3s ease-out, text-shadow 0.2s ease-out';
        el.style.transform = originalTransform || 'skewX(-3deg)';
        el.style.filter = 'none';
        el.style.textShadow = '2px 2px 0 #0A0A0A, 0 0 10px rgba(196, 30, 58, 0.5)';
        
        scheduleGlitch();
      }, 100 + Math.random() * 150);
    }
    
    scheduleGlitch();
  }

  /* =========================================
     6. SCROLL REVEAL FOR CARDS
     ========================================= */
  function initCardReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    dom.cards.forEach((card, i) => {
      // Set initial state for JS animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease-out ${i * 0.1}s, transform 0.6s var(--ease-out) ${i * 0.1}s`;
      observer.observe(card);
    });
  }

  /* =========================================
     INITIALIZATION
     ========================================= */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initClock();
        initTicker();
        initProgressBars();
        initCRTNoise();
        initGlitchEffects();
        initCardReveal();
      });
    } else {
      initClock();
      initTicker();
      initProgressBars();
      initCRTNoise();
      initGlitchEffects();
      initCardReveal();
    }
  }

  init();
})();
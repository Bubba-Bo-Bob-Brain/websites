/* ========================================
   SANKOFA ARCHIVE — Interactive Logic
   Afrofuturist Digital Experience
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==================== STATE MANAGEMENT ====================
  const state = {
    isLoaded: false,
    isPlaying: false,
    currentArtifact: 'mask',
    autoRotate: false,
    currentConstellation: 'dogon',
    scrollY: 0,
    mouseX: 0,
    mouseY: 0
  };

  // ==================== UTILITIES ====================
  const utils = {
    lerp: (start, end, factor) => start + (end - start) * factor,
    random: (min, max) => Math.random() * (max - min) + min,
    formatTime: (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    },
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // ==================== LOADING SEQUENCE ====================
  const initLoading = () => {
    const bar = document.getElementById('loadingBarFill');
    const screen = document.getElementById('loadingScreen');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += utils.random(2, 8);
      if (progress > 100) progress = 100;
      bar.style.width = `${progress}%`;
      
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          screen.classList.add('hidden');
          state.isLoaded = true;
          initEntranceAnimations();
        }, 500);
      }
    }, 50);
  };

  const initEntranceAnimations = () => {
    // Animate hero elements in
    const elements = document.querySelectorAll('.hero-content > *');
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + (i * 150));
    });

    initHeroCanvas();
    initScrollAnimations();
  };

  // ==================== CUSTOM CURSOR ====================
  const initCursor = () => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    
    if (!cursor || !ring) return;

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX = utils.lerp(cursorX, state.mouseX, 0.2);
      cursorY = utils.lerp(cursorY, state.mouseY, 0.2);
      ringX = utils.lerp(ringX, state.mouseX, 0.1);
      ringY = utils.lerp(ringY, state.mouseY, 0.1);

      cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .artifact-grid-item, .adinkra-card, .origin-card, .history-item');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  };

  // ==================== HERO CANVAS (STAR FIELD) ====================
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    const STAR_COUNT = 300;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 2 + 0.5; // Depth
        this.size = Math.random() * 1.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update(time) {
        // Parallax based on mouse
        const dx = (state.mouseX - width / 2) * 0.02 * this.z;
        const dy = (state.mouseY - height / 2) * 0.02 * this.z;
        
        this.x = this.baseX - dx;
        this.y = this.baseY - dy;

        // Twinkle
        this.opacity = 0.3 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${this.opacity})`; // Gold tint
        ctx.fill();
      }
    }

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw connecting lines for nearby stars (subtle)
      ctx.strokeStyle = 'rgba(212, 168, 67, 0.03)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < stars.length; i++) {
        stars[i].update(time);
        stars[i].draw(ctx);
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // ==================== NAVIGATION ====================
  const initNavigation = () => {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navMenuToggle');
    const menuLinks = document.querySelector('.nav-adinkra-links');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Toggle mobile menu
    if (toggle) {
      toggle.addEventListener('click', () => {
        menuLinks.classList.toggle('open');
        toggle.classList.toggle('active');
      });
    }

    // Scroll spy & Hide/Show nav
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      
      // Add scrolled class
      if (scrollPos > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Hide on scroll down, show on scroll up
      if (scrollPos > state.scrollY && scrollPos > 100) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      state.scrollY = scrollPos;

      // Active link
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollPos >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
          link.classList.add('active');
        }
      });
    });
  };

  // ==================== SCROLL ANIMATIONS ====================
  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Specific triggers
          if (entry.target.id === 'narrationText') {
            startNarration();
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .timeline-event, #narrationText').forEach(el => {
      observer.observe(el);
    });
  };

  // ==================== HOLOGRAPHIC ARTIFACTS ====================
  const initArtifacts = () => {
    const tabs = document.querySelectorAll('.artifact-tab');
    const gridItems = document.querySelectorAll('.artifact-grid-item');
    const rotateLeft = document.getElementById('rotateLeft');
    const rotateRight = document.getElementById('rotateRight');
    const autoRotateBtn = document.getElementById('autoRotate');
    const hologramContainer = document.getElementById('artifactHologram');
    const details = {
      name: document.querySelector('.artifact-name'),
      origin: document.querySelector('.artifact-origin'),
      desc: document.querySelector('.artifact-description'),
      metaValues: document.querySelectorAll('.meta-value')
    };

    // Artifact Data
    const artifacts = {
      mask: {
        name: 'Golden Mask of Ife',
        origin: 'Ile-Ife, Yorubaland — c. 12th Century CE',
        desc: 'Forged in the sacred city of Ife, this masterpiece embodies the divine kingship of the Ooni. The striated facial markings speak of lineage and cosmic order. Rendered here in holographic light, it exists simultaneously in the physical and digital realms.',
        meta: ['Nigeria', '1100–1300 CE', 'Gold / Holographic Light', 'Divine Kingship']
      },
      staff: {
        name: 'Opa Oranmiyan',
        origin: 'Benin City, Edo Kingdom — c. 15th Century CE',
        desc: 'A towering iron staff symbolizing the authority of the Oba and his connection to the earth god Ogun. The intricate ironwork represents the smith\'s mastery over the elements and the weight of governance.',
        meta: ['Nigeria', '1400–1500 CE', 'Iron / Gold Wire', 'Royal Authority']
      },
      stool: {
        name: 'The Golden Stool',
        origin: 'Kumasi, Ashanti Empire — c. 1700 CE',
        desc: 'Sika Dwa Kofi, the soul of the Ashanti nation. Believed to have descended from the sky, it houses the spirit of the people. It has never touched the ground and remains the ultimate symbol of unity.',
        meta: ['Ghana', '1700 CE', 'Gold / Wood', 'National Soul']
      },
      bronze: {
        name: 'Benin Bronze Head',
        origin: 'Benin City, Edo Kingdom — c. 16th Century CE',
        desc: 'One of thousands of plaques and sculptures looted in 1897. These works demonstrate a level of technical sophistication in bronze casting that rivaled any civilization of the era.',
        meta: ['Nigeria', '1500–1600 CE', 'Bronze / Brass', 'Court History']
      }
    };

    // SVG Templates for switching (Injected dynamically)
    const svgs = {
      mask: `<svg viewBox="0 0 300 400" width="300" height="400" class="artifact-svg">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#D4A843;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
          </linearGradient>
          <filter id="hologramGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <ellipse cx="150" cy="180" rx="90" ry="130" fill="url(#goldGrad)" filter="url(#hologramGlow)" opacity="0.9"/>
        <ellipse cx="115" cy="155" rx="20" ry="12" fill="#1A0A2E"/>
        <ellipse cx="185" cy="155" rx="20" ry="12" fill="#1A0A2E"/>
        <ellipse cx="115" cy="155" rx="8" ry="5" fill="#00F5D4" opacity="0.8"/>
        <ellipse cx="185" cy="155" rx="8" ry="5" fill="#00F5D4" opacity="0.8"/>
        <path d="M145 170 L150 210 L155 170" fill="none" stroke="#1A0A2E" stroke-width="2"/>
        <path d="M120 240 Q150 255 180 240" fill="none" stroke="#1A0A2E" stroke-width="2.5"/>
        <path d="M90 80 L150 30 L210 80" fill="none" stroke="#D4A843" stroke-width="3"/>
        <circle cx="150" cy="30" r="8" fill="#D4A843"/>
        <g opacity="0.15">
           <line x1="60" y1="60" x2="240" y2="60" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="100" x2="240" y2="100" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="140" x2="240" y2="140" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="180" x2="240" y2="180" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="220" x2="240" y2="220" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="260" x2="240" y2="260" stroke="#00F5D4" stroke-width="0.5"/>
        </g>
      </svg>`,
      staff: `<svg viewBox="0 0 300 400" width="300" height="400" class="artifact-svg">
        <defs>
          <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#888;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#333;stop-opacity:1" />
          </linearGradient>
          <filter id="hologramGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x="135" y="50" width="30" height="300" fill="url(#ironGrad)" filter="url(#hologramGlow)" opacity="0.9"/>
        <circle cx="150" cy="50" r="30" fill="none" stroke="#D4A843" stroke-width="4"/>
        <path d="M150 20 L150 0 M150 80 L150 100 M120 50 L100 50 M180 50 L200 50" stroke="#D4A843" stroke-width="2"/>
        <circle cx="150" cy="50" r="10" fill="#D4A843"/>
        <g opacity="0.15">
           <line x1="60" y1="60" x2="240" y2="60" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="120" x2="240" y2="120" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="180" x2="240" y2="180" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="240" x2="240" y2="240" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="300" x2="240" y2="300" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="360" x2="240" y2="360" stroke="#00F5D4" stroke-width="0.5"/>
        </g>
      </svg>`,
      stool: `<svg viewBox="0 0 300 400" width="300" height="400" class="artifact-svg">
        <defs>
          <linearGradient id="woodGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#B8860B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5C4008;stop-opacity:1" />
          </linearGradient>
          <filter id="hologramGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M100 120 L200 120 L210 250 L90 250 Z" fill="url(#woodGold)" filter="url(#hologramGlow)" opacity="0.9"/>
        <ellipse cx="150" cy="120" rx="60" ry="20" fill="url(#woodGold)"/>
        <ellipse cx="150" cy="250" rx="70" ry="15" fill="url(#woodGold)"/>
        <path d="M150 140 L150 230" stroke="#1A0A2E" stroke-width="2" opacity="0.5"/>
        <path d="M120 150 L120 240" stroke="#1A0A2E" stroke-width="1" opacity="0.3"/>
        <path d="M180 150 L180 240" stroke="#1A0A2E" stroke-width="1" opacity="0.3"/>
        <g opacity="0.15">
           <line x1="60" y1="60" x2="240" y2="60" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="100" x2="240" y2="100" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="140" x2="240" y2="140" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="180" x2="240" y2="180" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="220" x2="240" y2="220" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="260" x2="240" y2="260" stroke="#00F5D4" stroke-width="0.5"/>
        </g>
      </svg>`,
      bronze: `<svg viewBox="0 0 300 400" width="300" height="400" class="artifact-svg">
        <defs>
          <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#CD7F32;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
          </linearGradient>
          <filter id="hologramGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M100 300 Q100 100 150 60 Q200 100 200 300 Z" fill="url(#bronzeGrad)" filter="url(#hologramGlow)" opacity="0.9"/>
        <ellipse cx="150" cy="130" rx="35" ry="25" fill="#1A0A2E" opacity="0.6"/>
        <circle cx="135" cy="125" r="5" fill="#00F5D4" opacity="0.8"/>
        <circle cx="165" cy="125" r="5" fill="#00F5D4" opacity="0.8"/>
        <path d="M130 180 Q150 190 170 180" fill="none" stroke="#1A0A2E" stroke-width="2"/>
        <!-- Coral cap -->
        <path d="M110 60 L150 20 L190 60" fill="none" stroke="#C41E3A" stroke-width="4"/>
        <circle cx="150" cy="20" r="10" fill="#C41E3A"/>
        <g opacity="0.15">
           <line x1="60" y1="60" x2="240" y2="60" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="100" x2="240" y2="100" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="140" x2="240" y2="140" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="180" x2="240" y2="180" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="220" x2="240" y2="220" stroke="#00F5D4" stroke-width="0.5"/>
           <line x1="60" y1="260" x2="240" y2="260" stroke="#00F5D4" stroke-width="0.5"/>
        </g>
      </svg>`
    };

    let currentRotation = 0;

    const updateArtifact = (key) => {
      state.currentArtifact = key;
      const data = artifacts[key];
      
      // Update info
      details.name.textContent = data.name;
      details.origin.textContent = data.origin;
      details.desc.textContent = data.desc;
      data.meta.forEach((val, i) => {
        details.metaValues[i].textContent = val;
      });

      // Update SVG
      const modelContainer = document.querySelector('.artifact-model');
      if (modelContainer) {
        modelContainer.innerHTML = svgs[key];
      }

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelector(`[data-artifact="${key}"]`).classList.add('active');

      // Reset rotation
      currentRotation = 0;
      if (hologramContainer) {
        hologramContainer.style.transform = 'rotateY(0deg)';
      }
    };

    // Event Listeners
    tabs.forEach(tab => {
      tab.addEventListener('click', () => updateArtifact(tab.dataset.artifact));
    });

    gridItems.forEach(item => {
      item.addEventListener('click', () => updateArtifact(item.dataset.artifact));
    });

    const rotate = (direction) => {
      currentRotation += direction * 15;
      if (hologramContainer) {
        hologramContainer.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        hologramContainer.style.transform = `rotateY(${currentRotation}deg)`;
      }
    };

    if (rotateLeft) rotateLeft.addEventListener('click', () => rotate(-1));
    if (rotateRight) rotateRight.addEventListener('click', () => rotate(1));

    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        state.autoRotate = !state.autoRotate;
        autoRotateBtn.classList.toggle('active');
      });
    }

    // Auto rotate loop
    const animateRotation = () => {
      if (state.autoRotate) {
        currentRotation += 0.5;
        if (hologramContainer) {
          hologramContainer.style.transition = 'none';
          hologramContainer.style.transform = `rotateY(${currentRotation}deg)`;
        }
      }
      requestAnimationFrame(animateRotation);
    };
    animateRotation();
  };

  // ==================== ORAL HISTORY & AUDIO ====================
  const initOralHistory = () => {
    const playBtn = document.getElementById('playPause');
    const skipBack = document.getElementById('skipBack');
    const skipForward = document.getElementById('skipForward');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const waveformCanvas = document.getElementById('waveformCanvas');
    const volumeSlider = document.getElementById('volumeSlider');
    const historyItems = document.querySelectorAll('.history-item');

    let playTime = 0;
    const duration = 767; // 12:47 in seconds
    let waveformData = [];
    let animationId;

    // Generate waveform data
    if (waveformCanvas) {
      const ctx = waveformCanvas.getContext('2d');
      const bars = 100;
      for (let i = 0; i < bars; i++) {
        waveformData.push(Math.random() * 0.8 + 0.2);
      }

      const drawWaveform = () => {
        const w = waveformCanvas.width = waveformCanvas.offsetWidth;
        const h = waveformCanvas.height = waveformCanvas.offsetHeight;
        
        ctx.clearRect(0, 0, w, h);
        const barWidth = w / bars;
        const progressIndex = (playTime / duration) * bars;

        for (let i = 0; i < bars; i++) {
          const height = waveformData[i] * h * 0.8;
          const x = i * barWidth;
          const y = (h - height) / 2;
          
          ctx.fillStyle = i < progressIndex ? '#D4A843' : '#2B2B36';
          
          if (state.isPlaying && Math.abs(i - progressIndex) < 5) {
            // Active animation near playhead
            const activeHeight = height + Math.sin(Date.now() * 0.01 + i) * 20;
            ctx.fillRect(x + 2, (h - activeHeight) / 2, barWidth - 4, activeHeight);
          } else {
            ctx.fillRect(x + 2, y, barWidth - 4, height);
          }
        }

        if (state.isPlaying) {
          animationId = requestAnimationFrame(drawWaveform);
        }
      };

      drawWaveform();
    }

    // Play/Pause
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        playBtn.textContent = state.isPlaying ? '⏸' : '▶';
        
        if (state.isPlaying) {
          const startTime = Date.now() - (playTime * 1000);
          
          const tick = () => {
            if (!state.isPlaying) return;
            playTime = (Date.now() - startTime) / 1000;
            if (playTime >= duration) {
              playTime = 0;
              state.isPlaying = false;
              playBtn.textContent = '▶';
            }
            
            const pct = (playTime / duration) * 100;
            if (progressFill) progressFill.style.width = `${pct}%`;
            
            requestAnimationFrame(tick);
          };
          tick();
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    }

    // Progress bar click
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        playTime = pct * duration;
        if (progressFill) progressFill.style.width = `${pct * 100}%`;
      });
    }

    // Volume visual feedback
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        // In a real app, this would change audio volume
        // Here we just store it
        state.volume = e.target.value;
      });
    }

    // Track selection
    historyItems.forEach(item => {
      item.addEventListener('click', () => {
        historyItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        playTime = 0;
        state.isPlaying = false;
        if (playBtn) playBtn.textContent = '▶';
        if (progressFill) progressFill.style.width = '0%';
      });
    });
  };

  // ==================== GRIOT NARRATION ====================
  let narrationStarted = false;
  const startNarration = () => {
    if (narrationStarted) return;
    narrationStarted = true;

    const words = document.querySelectorAll('.narration-word');
    let index = 0;

    const revealWord = () => {
      if (index < words.length) {
        words[index].classList.add('revealed');
        
        // Add glow to random words for emphasis
        if (Math.random() > 0.7) {
          setTimeout(() => words[index].classList.add('glow'), 400);
        }
        
        index++;
        setTimeout(revealWord, utils.random(80, 200));
      }
    };

    revealWord();
  };

  // ==================== STAR MAP ====================
  const initStarMap = () => {
    const canvas = document.getElementById('starMapCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    
    // Constellation Data
    const constellations = {
      dogon: {
        points: [
          {x: 0.2, y: 0.3}, {x: 0.3, y: 0.2}, {x: 0.4, y: 0.4}, 
          {x: 0.5, y: 0.3}, {x: 0.6, y: 0.5}, {x: 0.7, y: 0.2}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [2,4]]
      },
      yoruba: {
        points: [
          {x: 0.3, y: 0.2}, {x: 0.2, y: 0.5}, {x: 0.4, y: 0.6},
          {x: 0.6, y: 0.4}, {x: 0.8, y: 0.3}, {x: 0.7, y: 0.7}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,3], [0,3]]
      },
      akan: {
        points: [
          {x: 0.2, y: 0.7}, {x: 0.3, y: 0.3}, {x: 0.5, y: 0.2},
          {x: 0.7, y: 0.3}, {x: 0.8, y: 0.7}, {x: 0.5, y: 0.5}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,0], [1,5], [3,5]]
      },
      zulu: {
        points: [
          {x: 0.1, y: 0.4}, {x: 0.3, y: 0.2}, {x: 0.5, y: 0.6},
          {x: 0.7, y: 0.4}, {x: 0.9, y: 0.5}, {x: 0.6, y: 0.2}
        ],
        lines: [[0,1], [1,5], [5,2], [2,3], [3,4], [1,2], [3,6]] // 6 is imaginary
      },
      kongo: {
        points: [
          {x: 0.2, y: 0.2}, {x: 0.8, y: 0.2}, {x: 0.8, y: 0.8},
          {x: 0.2, y: 0.8}, {x: 0.5, y: 0.5}
        ],
        lines: [[0,1], [1,2], [2,3], [3,0], [0,4], [1,4], [2,4], [3,4]]
      }
    };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      
      // Generate background stars
      stars.length = 0;
      for(let i=0; i<150; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
      });

      // Draw selected constellation
      const con = constellations[state.currentConstellation];
      if (con) {
        // Lines
        ctx.strokeStyle = 'rgba(212, 168, 67, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        con.lines.forEach(([a, b]) => {
          if (con.points[a] && con.points[b]) {
            ctx.beginPath();
            ctx.moveTo(con.points[a].x * width, con.points[a].y * height);
            ctx.lineTo(con.points[b].x * width, con.points[b].y * height);
            ctx.stroke();
          }
        });
        ctx.setLineDash([]);

        // Points
        con.points.forEach((p, i) => {
          const px = p.x * width;
          const py = p.y * height;
          
          // Glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
          grad.addColorStop(0, 'rgba(0, 245, 212, 0.8)');
          grad.addColorStop(1, 'rgba(0, 245, 212, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI*2);
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI*2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        });
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    // Interactions
    const cards = document.querySelectorAll('.origin-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.currentConstellation = card.dataset.constellation;
        
        // Update info panel (simple text swap for demo)
        const info = document.getElementById('constellationInfo');
        if (info) {
          const titles = {
            dogon: 'The Dogon Star System',
            yoruba: 'Yoruba Genesis: The Chain from Heaven',
            akan: 'Akan Creation: Nyame\'s Sky',
            zulu: 'Zulu Origins: Unkulunkulu',
            kongo: 'Kongo Cosmogram: Dikenga'
          };
          info.querySelector('.constellation-name').textContent = titles[state.currentConstellation];
        }
      });
    });
  };

  // ==================== TIMELINE ====================
  const initTimeline = () => {
    // Scroll reveal handled by IntersectionObserver in initScrollAnimations
    // Additional logic could go here for timeline scrubbing if needed
  };

  // ==================== INIT ALL ====================
  initLoading();
  initCursor();
  initNavigation();
  initArtifacts();
  initOralHistory();
  initStarMap();
  initTimeline();
  
  // Expose startNarration globally or via module if needed, 
  // but here it's called by IntersectionObserver callback.
  // We need to make sure the callback can access it.
  // Since startNarration is defined in this scope, we need to bind it or ensure it's available.
  // Actually, the observer is defined inside initScrollAnimations, so it has closure access.
  // BUT, I separated them for clarity. Let's move the observer logic to include the narration trigger 
  // or just call it directly.
  
  // Fixing the narration trigger scope:
  // The observer in initScrollAnimations calls startNarration. 
  // startNarration is defined in this scope.
  // However, startNarration is defined *after* initScrollAnimations call? 
  // No, function declarations are hoisted. 
  // But in the code structure above, I wrote:
  // const initScrollAnimations = () => { ... observer ... startNarration() ... }
  // const startNarration = () => { ... }
  // This works in JS because of hoisting if using function declarations, but with const arrow functions, 
  // it must be defined before usage.
  
  // To be safe, I will re-order or use a different pattern.
  // I will move startNarration definition up or call it inside initScrollAnimations properly.
  
  // Revised structure for safety:
  // I will define startNarration before initScrollAnimations or just inline the logic.
  
  // Actually, looking at the code flow:
  // initLoading calls initEntranceAnimations which calls initScrollAnimations.
  // So initScrollAnimations runs after DOMContentLoaded.
  // By that time, all const functions are initialized.
  // So it is safe.
  
});
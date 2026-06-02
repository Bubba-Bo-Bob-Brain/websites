const BootSequence = {
  lines: [
    'PIXEL ZONE BIOS v2.1',
    'COPYRIGHT (C) 1993, PIXEL SYSTEMS INC.',
    '',
    'CHECKING MEMORY... 128KB OK',
    'CHECKING CPU... 16-BIT PROCESSOR DETECTED',
    'CHECKING GPU... PIXEL-9000 INITIALIZED',
    'CHECKING SOUND... FM SYNTHESIS READY',
    'CHECKING CONTROLLERS... PORT 1: CONNECTED',
    '                            PORT 2: EMPTY',
    '',
    'LOADING CARTRIDGE DATA...',
    '████████████████████████ 100%',
    '',
    'ALL SYSTEMS NOMINAL',
    'BOOT COMPLETE',
    '',
    '> INITIALIZING PIXEL ZONE...',
    '> WELCOME, PLAYER 1',
    '> PRESS START'
  ],
  element: null,
  currentIndex: 0,
  currentChar: 0,
  typingSpeed: 12,
  lineDelay: 200,

  init() {
    this.element = document.getElementById('boot-text');
    this.typeLine();
  },

  typeLine() {
    if (this.currentIndex >= this.lines.length) {
      setTimeout(() => this.finish(), 800);
      return;
    }

    const line = this.lines[this.currentIndex];
    
    if (line === '') {
      this.element.textContent += '\n';
      this.currentIndex++;
      setTimeout(() => this.typeLine(), this.lineDelay / 2);
      return;
    }

    this.currentChar = 0;
    this.typeChar(line);
  },

  typeChar(line) {
    if (this.currentChar >= line.length) {
      this.element.textContent += '\n';
      this.currentIndex++;
      setTimeout(() => this.typeLine(), this.lineDelay);
      return;
    }

    this.element.textContent += line[this.currentChar];
    this.currentChar++;
    
    const speed = line.includes('████') ? 5 : this.typingSpeed;
    setTimeout(() => this.typeChar(line), speed);
  },

  finish() {
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.classList.add('fade-out');
    
    setTimeout(() => {
      bootScreen.style.display = 'none';
      document.getElementById('main-content').classList.add('visible');
    }, 800);
  }
};

const Starfield = {
  canvas: null,
  ctx: null,
  stars: [],
  numStars: 200,
  speed: 0.5,

  init() {
    this.canvas = document.getElementById('starfield');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createStars();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const time = Date.now() * 0.001;

    for (const star of this.stars) {
      star.y += star.speed * this.speed;

      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }

      const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinkleOffset);
      const opacity = star.opacity * (0.7 + 0.3 * twinkle);

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(200, 200, 255, ${opacity})`;
      this.ctx.fill();

      if (star.size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(200, 200, 255, ${opacity * 0.15})`;
        this.ctx.fill();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
};

const VHSTracking = {
  element: null,
  interval: null,

  init() {
    this.element = document.getElementById('vhs-tracking');
    this.scheduleNext();
  },

  scheduleNext() {
    const delay = Math.random() * 12000 + 6000;
    this.interval = setTimeout(() => {
      this.trigger();
      this.scheduleNext();
    }, delay);
  },

  trigger() {
    this.element.classList.add('active');
    setTimeout(() => {
      this.element.classList.remove('active');
    }, 300);
  }
};

const KonamiCode = {
  sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  currentIndex: 0,
  activated: false,

  init() {
    document.addEventListener('keydown', (e) => this.handleKey(e));
  },

  handleKey(e) {
    const key = e.key.toLowerCase ? e.key.toLowerCase() : e.key;
    const expected = this.sequence[this.currentIndex].toLowerCase ? this.sequence[this.currentIndex].toLowerCase() : this.sequence[this.currentIndex];

    if (key === expected || e.key === this.sequence[this.currentIndex]) {
      this.currentIndex++;
      if (this.currentIndex >= this.sequence.length) {
        this.activate();
      }
    } else {
      this.currentIndex = 0;
      if (key === this.sequence[0].toLowerCase() || e.key === this.sequence[0]) {
        this.currentIndex = 1;
      }
    }
  },

  activate() {
    if (this.activated) return;
    this.activated = true;

    const overlay = document.getElementById('cheat-overlay');
    overlay.classList.add('active');

    document.getElementById('cheat-close').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    document.addEventListener('keydown', function closeCheat(e) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        overlay.classList.remove('active');
        document.removeEventListener('keydown', closeCheat);
      }
    });
  }
};

const PixelMascot = {
  sprite: [
    { row: 1, pixels: [0,1,1,1,1,0] },
    { row: 2, pixels: [1,1,1,1,1,1] },
    { row: 3, pixels: [1,2,1,1,2,1] },
    { row: 4, pixels: [1,1,1,1,1,1] },
    { row: 5, pixels: [0,1,3,3,1,0] },
    { row: 6, pixels: [0,1,1,1,1,0] },
    { row: 7, pixels: [1,0,1,1,0,1] },
    { row: 8, pixels: [1,0,0,0,0,1] }
  ],
  colors: {
    0: 'transparent',
    1: '#00ffff',
    2: '#ff00ff',
    3: '#39ff14'
  },

  init() {
    this.render();
  },

  render() {
    const rows = document.querySelectorAll('.mascot-row');
    
    this.sprite.forEach((rowData, index) => {
      const rowEl = rows[index];
      if (!rowEl) return;
      
      rowEl.innerHTML = '';
      rowData.pixels.forEach((colorIndex) => {
        const span = document.createElement('span');
        span.style.backgroundColor = this.colors[colorIndex];
        if (colorIndex === 0) {
          span.style.opacity = '0';
        }
        span.style.boxShadow = colorIndex > 0 ? `0 0 4px ${this.colors[colorIndex]}` : 'none';
        rowEl.appendChild(span);
      });
    });
  }
};

const CartridgeFilter = {
  currentFilter: 'all',

  init() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter(btn.dataset.filter);
      });
    });
  },

  filter(genre) {
    this.currentFilter = genre;
    const cartridges = document.querySelectorAll('.cartridge');

    cartridges.forEach(cart => {
      const cartGenre = cart.dataset.genre;
      if (genre === 'all' || cartGenre === genre) {
        cart.style.display = '';
        cart.style.animation = 'cart-appear 0.4s ease-out backwards';
        cart.style.animationDelay = `${Math.random() * 0.2}s`;
      } else {
        cart.style.display = 'none';
      }
    });
  }
};

const Leaderboard = {
  init() {
    this.setupInitialInputs();
    this.setupSubmitButton();
  },

  setupInitialInputs() {
    const boxes = document.querySelectorAll('.initial-box');
    
    boxes.forEach((box, index) => {
      box.addEventListener('input', (e) => {
        const value = e.target.value.toUpperCase();
        e.target.value = value;
        
        if (value.length === 1 && index < boxes.length - 1) {
          boxes[index + 1].focus();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          boxes[index - 1].focus();
        }
      });

      box.addEventListener('focus', () => {
        box.select();
      });
    });
  },

  setupSubmitButton() {
    const btn = document.querySelector('.submit-score-btn');
    btn.addEventListener('click', () => {
      const initials = Array.from(document.querySelectorAll('.initial-box'))
        .map(box => box.value || '_')
        .join('');
      
      const scoreInput = document.querySelector('.score-input');
      const score = parseInt(scoreInput.value) || 0;

      if (initials === '___' && score === 0) {
        this.flashError();
        return;
      }

      this.addScore(initials, score);
      
      document.querySelectorAll('.initial-box').forEach(box => box.value = '');
      scoreInput.value = '';

      this.flashSuccess();
    });
  },

  addScore(initials, score) {
    const table = document.querySelector('.leaderboard-table');
    const rows = table.querySelectorAll('.leaderboard-row:not(.leaderboard-header-row)');
    
    const lastRow = rows[rows.length - 1];
    const lastRank = rows.length;

    lastRow.querySelector('.lb-name').textContent = initials;
    lastRow.querySelector('.lb-score').textContent = score.toLocaleString();
    lastRow.querySelector('.lb-game').textContent = 'NEW!';
    lastRow.querySelector('.lb-game').style.color = 'var(--neon-yellow)';
    lastRow.querySelector('.lb-game').style.textShadow = '0 0 8px var(--neon-yellow)';
    lastRow.style.animation = 'new-score-flash 0.5s ease-out 3';

    const style = document.createElement('style');
    style.textContent = `
      @keyframes new-score-flash {
        0%, 100% { background: transparent; }
        50% { background: rgba(255, 0, 255, 0.15); }
      }
    `;
    document.head.appendChild(style);
  },

  flashError() {
    const form = document.querySelector('.add-score-form');
    form.style.animation = 'form-shake 0.4s ease-out';
    setTimeout(() => { form.style.animation = ''; }, 400);

    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.textContent = `
        @keyframes form-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `;
      document.head.appendChild(style);
    }
  },

  flashSuccess() {
    const btn = document.querySelector('.submit-score-btn');
    const originalText = btn.textContent;
    btn.textContent = 'SCORE SAVED!';
    btn.style.background = 'var(--neon-green)';
    btn.style.boxShadow = '0 0 30px var(--neon-green)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
    }, 1500);
  }
};

const VHSPlayer = {
  currentMemory: 0,
  isPlaying: true,
  counter: 0,
  counterInterval: null,
  timestampInterval: null,
  memories: [
    { year: 'SUMMER 1994', text: '"I remember staying up all night with my best friend, taking turns trying to beat the final boss. We finally did it at 3 AM and woke up the whole house cheering."', attr: '— PLAYER1, 1994' },
    { year: 'WINTER 1993', text: '"The day I got my first console for Christmas. The smell of new plastic and the excitement of unboxing. Best. Day. Ever."', attr: '— SNOW_KID, 1993' },
    { year: 'SPRING 1994', text: '"Rental weekends at Blockbuster. Walking the aisle for 30 minutes to pick THE perfect game. Then realizing I picked wrong on the drive home."', attr: '— RENTAL_RICK, 1994' },
    { year: 'FALL 1995', text: '"Trading secrets on the playground. Did you find the warp zone in level 1-2? That question made you legendary."', attr: '— SECRET_SEEKER, 1995' },
    { year: 'SUMMER 1996', text: '"The transition to 3D. Everything changed. But the 2D love never faded. Some of us still prefer pixels over polygons."', attr: '— PIXEL_PURIST, 1996' }
  ],

  init() {
    this.setupControls();
    this.setupMemoryCards();
    this.startCounter();
    this.startTimestamp();
    this.startAutoAdvance();
  },

  setupControls() {
    document.querySelectorAll('.vhs-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleAction(action);
      });
    });
  },

  setupMemoryCards() {
    document.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.memory);
        this.showMemory(index + 1);
        this.triggerTracking();
      });
    });
  },

  handleAction(action) {
    this.triggerTracking();

    switch (action) {
      case 'play':
        this.isPlaying = true;
        this.startCounter();
        break;
      case 'stop':
        this.isPlaying = false;
        this.stopCounter();
        break;
      case 'rew':
        this.currentMemory = (this.currentMemory - 1 + this.memories.length) % this.memories.length;
        this.updateDisplay();
        this.counter = Math.max(0, this.counter - 50);
        break;
      case 'ff':
        this.currentMemory = (this.currentMemory + 1) % this.memories.length;
        this.updateDisplay();
        this.counter += 50;
        break;
    }
  },

  showMemory(index) {
    this.currentMemory = index % this.memories.length;
    this.updateDisplay();
  },

  updateDisplay() {
    const memory = this.memories[this.currentMemory];
    
    const overlayText = document.getElementById('vhs-overlay-text');
    const memoryText = document.getElementById('vhs-memory-text');
    const memoryAttr = document.getElementById('vhs-memory-attr');

    overlayText.style.opacity = '0';
    memoryText.style.opacity = '0';
    memoryAttr.style.opacity = '0';

    setTimeout(() => {
      overlayText.textContent = memory.year;
      memoryText.textContent = memory.text;
      memoryAttr.textContent = memory.attr;

      overlayText.style.opacity = '1';
      memoryText.style.opacity = '1';
      memoryAttr.style.opacity = '1';
    }, 200);
  },

  triggerTracking() {
    const lines = document.querySelector('.vhs-tracking-lines');
    lines.classList.add('active');
    setTimeout(() => lines.classList.remove('active'), 500);
  },

  startCounter() {
    if (this.counterInterval) return;
    this.counterInterval = setInterval(() => {
      this.counter++;
      const counterEl = document.getElementById('vhs-counter');
      counterEl.textContent = String(this.counter).padStart(4, '0');
    }, 1000);
  },

  stopCounter() {
    clearInterval(this.counterInterval);
    this.counterInterval = null;
  },

  startTimestamp() {
    this.updateTimestamp();
    this.timestampInterval = setInterval(() => this.updateTimestamp(), 1000);
  },

  updateTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.getElementById('vhs-timestamp');
    if (el) el.textContent = `${h}:${m}:${s}`;
  },

  startAutoAdvance() {
    setInterval(() => {
      if (this.isPlaying) {
        this.currentMemory = (this.currentMemory + 1) % this.memories.length;
        this.updateDisplay();
      }
    }, 15000);
  }
};

const StatCounter = {
  observed: false,

  init() {
    this.setupObserver();
  },

  setupObserver() {
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.observed) {
          this.observed = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsBar);
  },

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        
        counter.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      animate();
    });
  }
};

const SectionReveal = {
  init() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(section => observer.observe(section));
  }
};

const NavHighlight = {
  init() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--neon-cyan)';
              link.style.textShadow = '0 0 10px var(--neon-cyan)';
            } else {
              link.style.color = '';
              link.style.textShadow = '';
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }
};

const GlitchEffect = {
  init() {
    this.scheduleGlitch();
  },

  scheduleGlitch() {
    const delay = Math.random() * 15000 + 8000;
    setTimeout(() => {
      this.triggerGlitch();
      this.scheduleGlitch();
    }, delay);
  },

  triggerGlitch() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.style.animation = 'page-glitch 0.15s ease-out';
    
    setTimeout(() => {
      mainContent.style.animation = '';
    }, 150);
  }
};

const CursorTrail = {
  particles: [],
  maxParticles: 8,

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    document.addEventListener('mousemove', (e) => {
      this.createParticle(e.clientX, e.clientY);
    });
  },

  createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: var(--neon-magenta);
      box-shadow: 0 0 6px var(--neon-magenta);
      pointer-events: none;
      z-index: 9990;
      transition: all 0.6s ease-out;
      image-rendering: pixelated;
    `;
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.opacity = '0';
      particle.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px) scale(0)`;
    });

    setTimeout(() => {
      particle.remove();
    }, 600);

    this.particles.push(particle);
    if (this.particles.length > this.maxParticles) {
      const old = this.particles.shift();
      if (old.parentNode) old.remove();
    }
  }
};

const CartAppearStyle = {
  init() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cart-appear {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
};

const GlitchStyle = {
  init() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes page-glitch {
        0% { transform: translate(0); filter: none; }
        20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
        40% { transform: translate(3px, -1px); filter: hue-rotate(-90deg) saturate(2); }
        60% { transform: translate(-2px, -2px); filter: hue-rotate(45deg); }
        80% { transform: translate(2px, 1px); filter: none; }
        100% { transform: translate(0); filter: none; }
      }
    `;
    document.head.appendChild(style);
  }
};

const PowerLEDEffect = {
  init() {
    const nav = document.getElementById('retro-nav');
    const led = document.querySelector('.power-led');
    
    if (!led) return;

    let mouseNear = false;
    
    document.addEventListener('mousemove', (e) => {
      const navRect = nav.getBoundingClientRect();
      const distance = Math.abs(e.clientY - navRect.top);
      
      if (distance < 80 && !mouseNear) {
        mouseNear = true;
        led.style.background = 'var(--neon-green)';
        led.style.boxShadow = '0 0 6px var(--neon-green), 0 0 12px var(--neon-green), 0 0 20px var(--neon-green)';
      } else if (distance >= 80 && mouseNear) {
        mouseNear = false;
        led.style.background = '';
        led.style.boxShadow = '';
      }
    });
  }
};

const EasterEggHint = {
  init() {
    const hint = document.querySelector('.secret-hint');
    if (!hint) return;

    let clickCount = 0;
    
    hint.addEventListener('click', () => {
      clickCount++;
      
      if (clickCount >= 3) {
        const blink = hint.querySelector('.secret-blink');
        blink.textContent = 'ACCESS GRANTED';
        blink.style.color = 'var(--neon-green)';
        blink.style.textShadow = '0 0 10px var(--neon-green)';
        
        setTimeout(() => {
          blink.textContent = 'ACCESS DENIED';
          blink.style.color = '';
          blink.style.textShadow = '';
          clickCount = 0;
        }, 3000);
      }
    });
  }
};

const HeroPrompt = {
  init() {
    const prompt = document.querySelector('.hero-prompt');
    if (!prompt) return;

    prompt.addEventListener('click', () => {
      const collection = document.getElementById('collection');
      if (collection) {
        collection.scrollIntoView({ behavior: 'smooth' });
      }

      prompt.style.color = 'var(--neon-green)';
      prompt.style.textShadow = '0 0 15px var(--neon-green)';
      prompt.textContent = 'GAME START! ▶';
      
      setTimeout(() => {
        prompt.style.color = '';
        prompt.style.textShadow = '';
        prompt.textContent = 'PRESS START ▶';
      }, 2000);
    });
  }
};

const SoundEffects = {
  audioCtx: null,

  init() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  },

  playBeep(frequency, duration, volume) {
    if (!this.audioCtx) return;
    
    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(volume || 0.05, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      
      oscillator.start(this.audioCtx.currentTime);
      oscillator.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Silently fail if audio context is not available
    }
  },

  playCoinSound() {
    this.playBeep(987, 0.1, 0.04);
    setTimeout(() => this.playBeep(1319, 0.15, 0.04), 100);
  },

  playNavSound() {
    this.playBeep(440, 0.05, 0.02);
  }
};

const CoinSlot = {
  init() {
    const slot = document.querySelector('.arcade-coin-slot');
    if (!slot) return;

    slot.style.cursor = 'pointer';
    slot.addEventListener('click', () => {
      SoundEffects.playCoinSound();
      
      slot.style.transform = 'scale(0.95)';
      setTimeout(() => {
        slot.style.transform = '';
      }, 150);

      const form = document.querySelector('.add-score-form');
      form.style.animation = 'form-highlight 0.5s ease-out';
      setTimeout(() => { form.style.animation = ''; }, 500);

      if (!document.getElementById('coin-style')) {
        const style = document.createElement('style');
        style.id = 'coin-style';
        style.textContent = `
          @keyframes form-highlight {
            0% { box-shadow: none; }
            50% { box-shadow: inset 0 0 30px rgba(255, 255, 0, 0.15); }
            100% { box-shadow: none; }
          }
        `;
        document.head.appendChild(style);
      }

      const firstBox = document.querySelector('.initial-box');
      if (firstBox) firstBox.focus();
    });
  }
};

const NavSoundIntegration = {
  init() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        SoundEffects.playNavSound();
      });
    });
  }
};

const App = {
  async init() {
    BootSequence.init();
    Starfield.init();

    await new Promise(resolve => setTimeout(resolve, 3500));

    VHSTracking.init();
    KonamiCode.init();
    PixelMascot.init();
    CartridgeFilter.init();
    Leaderboard.init();
    VHSPlayer.init();
    StatCounter.init();
    SectionReveal.init();
    NavHighlight.init();
    GlitchEffect.init();
    CursorTrail.init();
    CartAppearStyle.init();
    GlitchStyle.init();
    PowerLEDEffect.init();
    EasterEggHint.init();
    HeroPrompt.init();
    SoundEffects.init();
    CoinSlot.init();
    NavSoundIntegration.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
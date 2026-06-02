// === ARCANE CODEX v1.0.4 ===
// Core Systems & Interactivity Module
// --------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavigation();
  initHeroCanvas();
  initScrollAnimations();
  initTerminal();
  initInventoryInteractions();
  initLoreCards();
  initGlitchEffects();
});

// === SYSTEM CONFIGURATION ===
const CONFIG = {
  particleCount: 100,
  particleColors: ['#ffd700', '#2d1b4e', '#00f3ff', '#ff6b35'],
  typingSpeed: 30,
  glitchInterval: 8000,
  scrollThreshold: 100
};

// === LOADER SYSTEM ===
function initLoader() {
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('loader-bar');
  
  if (!loader || !progressBar) return;
  
  let progress = 0;
  const loadingSteps = [
    { pct: 15, msg: 'Initializing void connection...' },
    { pct: 35, msg: 'Decrypting ancient runes...' },
    { pct: 60, msg: 'Calibrating particle emitters...' },
    { pct: 85, msg: 'Binding spell matrices...' },
    { pct: 100, msg: 'Codex ready.' }
  ];
  
  let stepIndex = 0;
  
  function advanceLoading() {
    if (stepIndex >= loadingSteps.length) {
      setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroEntrance();
      }, 500);
      return;
    }
    
    const step = loadingSteps[stepIndex];
    progress = step.pct;
    progressBar.style.width = `${progress}%`;
    
    stepIndex++;
    
    const delay = 300 + Math.random() * 400;
    setTimeout(advanceLoading, delay);
  }
  
  setTimeout(advanceLoading, 500);
}

// === CUSTOM CURSOR SYSTEM ===
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  
  if (!dot || !outline) return;
  
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    outline.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });
  
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();
  
  const interactiveElements = document.querySelectorAll('a, button, .inventory-card, .lore-card, input');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.background = '#00f3ff';
      outline.style.width = '60px';
      outline.style.height = '60px';
      outline.style.borderColor = 'rgba(0, 243, 255, 0.6)';
    });
    
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.background = '#ffd700';
      outline.style.width = '40px';
      outline.style.height = '40px';
      outline.style.borderColor = 'rgba(255, 215, 0, 0.5)';
    });
  });
}

// === NAVIGATION SYSTEM ===
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!nav) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > CONFIG.scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// === HERO CANVAS PARTICLE SYSTEM ===
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.color = CONFIG.particleColors[Math.floor(Math.random() * CONFIG.particleColors.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.life = Math.random() * 100 + 50;
      this.maxLife = this.life;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
      
      if (this.life <= 0) {
        this.reset();
      }
    }
    
    draw() {
      const lifeRatio = this.life / this.maxLife;
      const currentOpacity = this.opacity * lifeRatio;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = currentOpacity;
      ctx.fill();
      
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = currentOpacity * 0.1;
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    }
  }
  
  let mouseX = 0;
  let mouseY = 0;
  
  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    particles.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.speedX += (dx / dist) * force * 0.02;
        p.speedY += (dy / dist) * force * 0.02;
      }
    });
  });
  
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(new Particle());
  }
  
  function drawConnections() {
    const maxDist = 100;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

// === HERO ENTRANCE ANIMATION ===
function triggerHeroEntrance() {
  const tl = gsap.timeline();
  
  tl.to('#hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .to('#hero-title', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.4')
  .to('#hero-divider', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.2')
  .to('#hero-desc', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.2')
  .to('#hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4')
  .to('#scroll-indicator', {
    opacity: 1,
    duration: 1
  }, '-=0.2');
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  const revealElements = document.querySelectorAll('.gs-reveal');
  
  revealElements.forEach((el, i) => {
    gsap.fromTo(el, 
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        delay: i * 0.1
      }
    );
  });
  
  gsap.to('#hero-title', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  gsap.from('.lore-card', {
    opacity: 0,
    y: 100,
    rotateX: 15,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#lore',
      start: 'top 70%'
    }
  });
  
  gsap.from('.inventory-card', {
    opacity: 0,
    scale: 0.8,
    stagger: {
      amount: 0.5,
      from: 'start'
    },
    duration: 0.8,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '#inventory',
      start: 'top 70%'
    }
  });
}

// === TERMINAL SYSTEM ===
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  
  if (!terminalBody || !terminalOutput || !terminalInput) return;
  
  const commands = {
    help: {
      output: 'Available commands:\n  help          - Show this help message\n  clear         - Clear terminal\n  whoami        - Display user info\n  cast-fireball - Cast a fireball spell\n  ls            - List files\n  cat           - Display file contents\n  exit          - Close terminal\n  echo          - Repeat input',
      type: 'info'
    },
    clear: {
      output: null,
      action: () => {
        terminalOutput.innerHTML = '';
        return '';
      }
    },
    whoami: {
      output: 'User: Arch-Mage (Level 99)\nClass: Frontend Developer\nGuild: The Arcane Grid\nStatus: Online',
      type: 'success'
    },
    'cast-fireball': {
      output: 'CASTING FIREBALL...\n\nDamage: 9999\nTarget: Minified CSS\nCritical Hit!\n\nThe code burns with elegant fury.',
      type: 'success',
      action: () => {
        document.body.style.animation = 'none';
        document.body.offsetHeight;
        document.body.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 500);
      }
    },
    ls: {
      output: 'spells/\n  fireball.js\n  shield.css\n  heal.html\ninventory/\n  sword-of-refactor.json\n  potion-of-debug.js\nREADME.md\npackage.json',
      type: 'info'
    },
    cat: {
      output: 'Usage: cat <filename>\nTry: cat README.md',
      type: 'info'
    },
    'cat README.md': {
      output: 'README.md\n\n# The Arcane Codex\n\nA retro-fantasy RPG interface\nbuilt with pure HTML, CSS, and JS.\n\n## Installation\n\nnpm install arcane-codex\nnpm run dev\n\n## License\n\nMIT - The Guild permits all usage.',
      type: 'info'
    },
    exit: {
      output: 'You cannot leave. The CSS binds you here.',
      type: 'error'
    },
    echo: {
      output: 'Usage: echo <message>\nRepeats your message back to you.',
      type: 'info'
    }
  };
  
  let commandHistory = [];
  let historyIndex = -1;
  
  function typeText(text, type) {
    const div = document.createElement('div');
    div.className = `mb-2 ${type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-400' : 'text-cyan-400'}`;
    
    const lines = text.split('\n');
    let lineIndex = 0;
    
    function typeLine() {
      if (lineIndex >= lines.length) {
        scrollToBottom();
        return;
      }
      
      const line = document.createElement('div');
      line.textContent = lines[lineIndex];
      div.appendChild(line);
      lineIndex++;
      
      setTimeout(typeLine, CONFIG.typingSpeed);
    }
    
    terminalOutput.appendChild(div);
    typeLine();
  }
  
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
  
  function executeCommand(input) {
    const args = input.trim().split(' ');
    const cmd = args[0];
    const fullCmd = args.join(' ');
    
    commandHistory.push(input);
    historyIndex = commandHistory.length;
    
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'mb-2';
    cmdDiv.innerHTML = `<span class="text-yellow-400">></span> <span class="text-white">${input}</span>`;
    terminalOutput.appendChild(cmdDiv);
    
    if (commands[fullCmd]) {
      const command = commands[fullCmd];
      if (command.action) command.action();
      if (command.output) typeText(command.output, command.type);
    } else if (commands[cmd]) {
      const command = commands[cmd];
      if (command.action) {
        const result = command.action();
        if (result || result === '') typeText(result || command.output || '', command.type);
      } else if (command.output) {
        typeText(command.output, command.type);
      }
    } else if (cmd === 'echo' && args.length > 1) {
      typeText(args.slice(1).join(' '));
    } else if (cmd === '') {
    } else {
      typeText(`Command not found: ${cmd}\nType 'help' for available commands.`, 'error');
    }
  }
  
  const bootSequence = [
    { text: 'Initializing Arcane Terminal v1.0.4...', delay: 500 },
    { text: 'Loading spell modules...', delay: 800 },
    { text: 'Connecting to the Grid...', delay: 1100 },
    { text: 'Access granted. Welcome, Arch-Mage.', delay: 1400 }
  ];
  
  let bootIndex = 0;
  
  function runBootSequence() {
    if (bootIndex >= bootSequence.length) {
      terminalInput.focus();
      return;
    }
    
    const step = bootSequence[bootIndex];
    setTimeout(() => {
      typeText(step.text, 'info');
      bootIndex++;
      runBootSequence();
    }, step.delay);
  }
  
  setTimeout(runBootSequence, 2000);
  
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      if (input) {
        executeCommand(input);
      }
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });
  
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
}

// === INVENTORY INTERACTIONS ===
function initInventoryInteractions() {
  const cards = document.querySelectorAll('.inventory-card');
  
  cards.forEach(card => {
    const rarity = card.dataset.rarity;
    
    const rarityColors = {
      legendary: '#ffd700',
      epic: '#a855f7',
      rare: '#3b82f6',
      common: '#9ca3af'
    };
    
    const color = rarityColors[rarity] || '#9ca3af';
    card.style.setProperty('--rarity-color', color);
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
    
    card.addEventListener('click', () => {
      const title = card.querySelector('.inventory-card-title').textContent;
      showItemModal(title, card.dataset);
    });
  });
}

// === LORE CARD INTERACTIONS ===
function initLoreCards() {
  const cards = document.querySelectorAll('.lore-card');
  
  cards.forEach(card => {
    const bg = card.querySelector('.lore-card-bg');
    
    card.addEventListener('mouseenter', () => {
      if (bg) {
        bg.style.filter = 'grayscale(0)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (bg) {
        bg.style.filter = 'grayscale(1)';
      }
    });
  });
}

// === GLITCH EFFECTS ===
function initGlitchEffects() {
  const glitches = document.querySelectorAll('.glitch-wrapper');
  
  glitches.forEach(el => {
    setInterval(() => {
      const intensity = Math.random();
      el.style.setProperty('--glitch-intensity', intensity);
    }, CONFIG.glitchInterval);
  });
  
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  const chars = '!<>-_\\/[]{}--=+*^?#________';
  
  scrambleElements.forEach(el => {
    const originalText = el.textContent;
    let interval;
    
    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      
      clearInterval(interval);
      
      interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    });
    
    el.addEventListener('mouseleave', () => {
      clearInterval(interval);
      el.textContent = originalText;
    });
  });
}

// === UTILITY FUNCTIONS ===
function showItemModal(title, data) {
  console.log(`Inspecting: ${title}`, data);
}

// === SHAKE ANIMATION ===
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyles);

// === CLEANUP ===
window.addEventListener('beforeunload', () => {
  if (typeof gsap !== 'undefined') {
    gsap.globalTimeline.clear();
  }
});
/* ==========================================
   THE GENESIS WASTES - Biopunk RPG
   JavaScript: Interactive Wasteland Engine
   ========================================== */

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all systems
  LoadingSystem.init();
  CursorSystem.init();
  ParticleSystem.init();
  NavigationSystem.init();
  ScrollSystem.init();
  CounterSystem.init();
  MutationSystem.init();
  ZoneMapSystem.init();
  TechTreeSystem.init();
  ModalSystem.init();
  BreathingSystem.init();
});

// ===== LOADING SYSTEM =====
const LoadingSystem = {
  init() {
    this.screen = document.getElementById('loading-screen');
    this.bar = document.querySelector('.loader-bar');
    this.text = document.querySelector('.loader-text');
    
    // Simulate loading sequence
    this.messages = [
      'Sequencing DNA strands...',
      'Mutating neural pathways...',
      'Contaminating environment...',
      'Calibrating bio-signatures...',
      'Initializing wasteland...',
      'System operational.'
    ];
    
    this.updateMessage(0);
    this.simulateLoading();
  },
  
  updateMessage(index) {
    if (index < this.messages.length) {
      this.text.textContent = this.messages[index];
    }
  },
  
  simulateLoading() {
    let progress = 0;
    let messageIndex = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          this.screen.classList.add('loaded');
          document.body.style.overflow = '';
          ScrollSystem.revealAll();
        }, 400);
      }
      
      // Update messages based on progress
      const newMessageIndex = Math.min(
        Math.floor(progress / 20),
        this.messages.length - 1
      );
      if (newMessageIndex !== messageIndex) {
        messageIndex = newMessageIndex;
        this.updateMessage(messageIndex);
      }
      
      this.bar.style.width = `${progress}%`;
    }, 200);
  }
};

// ===== CUSTOM CURSOR SYSTEM =====
const CursorSystem = {
  init() {
    this.cursor = document.getElementById('custom-cursor');
    this.dot = this.cursor.querySelector('.cursor-dot');
    this.ring = this.cursor.querySelector('.cursor-ring');
    
    this.pos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    
    this.setupListeners();
    this.animate();
  },
  
  setupListeners() {
    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    });
    
    // Add hover detection for interactive elements
    const hoverTargets = 'a, button, .mutation-card, .tech-node, .survival-card, .filter-btn, .map-zone';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
        this.cursor.classList.add('hovering');
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
        this.cursor.classList.remove('hovering');
      }
    });
  },
  
  animate() {
    // Smooth interpolation for ring
    this.ringPos.x += (this.pos.x - this.ringPos.x) * 0.15;
    this.ringPos.y += (this.pos.y - this.ringPos.y) * 0.15;
    
    // Direct movement for dot
    this.dot.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) translate(-50%, -50%)`;
    this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px) translate(-50%, -50%)`;
    
    requestAnimationFrame(() => this.animate());
  }
};

// ===== PARTICLE SYSTEM =====
const ParticleSystem = {
  init() {
    this.canvas = document.getElementById('spore-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 60;
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  },
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  
  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  },
  
  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: Math.random() * -0.5 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0, 255, 204' : '57, 255, 20',
      pulse: Math.random() * Math.PI * 2
    };
  },
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, index) => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;
      
      // Pulse opacity
      const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
      this.ctx.fill();
      
      // Add glow effect
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${currentOpacity * 0.3})`;
      this.ctx.fill();
      
      // Reset if out of bounds
      if (p.y < -10 || p.x < -10 || p.x > this.canvas.width + 10) {
        this.particles[index] = this.createParticle();
        this.particles[index].y = this.canvas.height + 10;
        this.particles[index].x = Math.random() * this.canvas.width;
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
};

// ===== NAVIGATION SYSTEM =====
const NavigationSystem = {
  init() {
    this.nav = document.getElementById('main-nav');
    this.links = document.querySelectorAll('.nav-link');
    this.toggle = document.querySelector('.nav-toggle');
    this.navLinksContainer = document.querySelector('.nav-links');
    
    this.lastScrollY = 0;
    this.ticking = false;
    
    this.setupScrollBehavior();
    this.setupActiveStates();
    this.setupMobileToggle();
    this.setupSmoothScroll();
  },
  
  setupScrollBehavior() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Hide/show based on scroll direction
          if (currentScrollY > 100) {
            this.nav.classList.add('nav-scrolled');
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
              this.nav.classList.add('nav-hidden');
            } else {
              this.nav.classList.remove('nav-hidden');
            }
          } else {
            this.nav.classList.remove('nav-scrolled');
            this.nav.classList.remove('nav-hidden');
          }
          
          this.lastScrollY = currentScrollY;
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  },
  
  setupActiveStates() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    
    sections.forEach(section => observer.observe(section));
  },
  
  setupMobileToggle() {
    this.toggle.addEventListener('click', () => {
      this.navLinksContainer.classList.toggle('mobile-open');
      this.toggle.classList.toggle('active');
    });
  },
  
  setupSmoothScroll() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          this.navLinksContainer.classList.remove('mobile-open');
          this.toggle.classList.remove('active');
        }
      });
    });
  }
};

// ===== SCROLL REVEAL SYSTEM =====
const ScrollSystem = {
  init() {
    this.elements = document.querySelectorAll('.reveal');
    
    this.setupObserver();
    this.revealAll(); // For post-loading
  },
  
  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => this.observer.observe(el));
  },
  
  revealAll() {
    // Trigger any elements that should be visible
    setTimeout(() => {
      document.querySelectorAll('.hero-classification, .hero-title .title-line, .hero-subtitle, .hero-description, .hero-actions, .hero-stats, .hero-scroll-indicator').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }, 100);
  }
};

// ===== COUNTER ANIMATION SYSTEM =====
const CounterSystem = {
  init() {
    this.counters = document.querySelectorAll('.stat-value[data-count]');
    this.setupObserver();
  },
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.counters.forEach(counter => observer.observe(counter));
  },
  
  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * easeOut);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
};

// ===== MUTATION FILTERING SYSTEM =====
const MutationSystem = {
  init() {
    this.cards = document.querySelectorAll('.mutation-card');
    this.filters = document.querySelectorAll('.filter-btn');
    
    this.setupFilters();
    this.setupStatBars();
  },
  
  setupFilters() {
    this.filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active state
        this.filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards with animation
        this.cards.forEach((card, index) => {
          const type = card.dataset.type;
          const shouldShow = filter === 'all' || type === filter;
          
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          
          if (shouldShow) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  },
  
  setupStatBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.stat-bar-fill');
          fills.forEach(fill => {
            const level = fill.dataset.level;
            fill.style.setProperty('--target-width', `${level}%`);
            fill.classList.add('animated');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    this.cards.forEach(card => observer.observe(card));
  }
};

// ===== ZONE MAP SYSTEM =====
const ZoneMapSystem = {
  init() {
    this.zones = document.querySelectorAll('.map-zone');
    this.panel = document.getElementById('zone-info-panel');
    this.closeBtn = this.panel.querySelector('.panel-close');
    
    this.zoneData = {
      'haven': {
        name: 'Haven',
        subtitle: 'Settlement Alpha',
        contamination: '12%',
        threat: 'LOW',
        resources: 'Moderate - Basic supplies, medical equipment',
        survivors: '~2,400',
        description: 'The last bastion of pre-fall civilization. Protected by a massive bio-dome grown from engineered coral. Safe haven for non-mutated humans and mild mutants alike.',
        warnings: ['Maintain quarantine protocols at all times', 'Report any aggressive mutations immediately']
      },
      'mycelial': {
        name: 'Mycelial Plains',
        subtitle: 'The Spore Plains',
        contamination: '45%',
        threat: 'MODERATE',
        resources: 'Abundant - Fungal biomass, spore extracts',
        survivors: 'Scattered nomadic clans',
        description: 'A vast expanse of interconnected fungal networks that pulse with bioluminescent light. The mycelium connects everything here — walk softly, for the plains remember every footstep.',
        warnings: ['Do not inhale spores without filtration', 'Avoid sleeping near glowing clusters']
      },
      'flesh-gardens': {
        name: 'Flesh Gardens',
        subtitle: 'The Living Gardens',
        contamination: '68%',
        threat: 'DANGEROUS',
        resources: 'Rare - Mutagenic flora, genetic material',
        survivors: 'The Bloom faction territory',
        description: 'Where the boundary between plant and animal dissolved completely. Towering organisms of fused flesh and vegetation roam freely. Beautiful. Deadly. Hungry.',
        warnings: ['Do not touch any flora', 'Travel only during daylight hours', 'The Bloom does not tolerate trespassers']
      },
      'crucible': {
        name: 'The Crucible',
        subtitle: 'Ground Zero',
        contamination: '97%',
        threat: 'CRITICAL',
        resources: 'Extreme - Unknown mutagenic compounds',
        survivors: 'None recorded',
        description: 'The epicenter of the Great Mutation. Reality itself warps here. Time moves differently. Those who enter rarely return, and those who do... are not the same.',
        warnings: ['Full bio-hazard protocol required', 'Maximum 4 hours exposure', 'Do not follow voices', 'Do not trust your eyes']
      },
      'whisper': {
        name: 'The Whisper',
        subtitle: 'Reality Fracture',
        contamination: 'Unknown',
        threat: 'ANOMALY',
        resources: 'Impossible to quantify',
        survivors: 'Unknown entities',
        description: 'Where the veil between dimensions grew thin. Geometry defies logic. Visitors report hearing their own thoughts spoken back to them. Some say it\'s the wasteland thinking.',
        warnings: ['Do not make eye contact with reflections', 'Do not acknowledge the whispers', 'Leave no offerings']
      },
      'rust-canopy': {
        name: 'Rust Canopy',
        subtitle: 'Canopy Wastes',
        contamination: '38%',
        threat: 'MODERATE',
        resources: 'Good - Pre-fall tech, scrap metal',
        survivors: 'Scavenger outposts, ~800',
        description: 'Pre-fall skyscrapers overgrown with metallic vines. The iron-root trees have fused with the buildings, creating a vertical ecosystem of rust and biology.',
        warnings: ['Watch for structural collapse', 'Beware of rust-mites in the lower levels']
      },
      'blood-fen': {
        name: 'Blood Fen',
        subtitle: 'The Crimson Fen',
        contamination: '72%',
        threat: 'DANGEROUS',
        resources: 'Rich - Bio-luminescent compounds',
        survivors: 'None',
        description: 'A vast wetland where the water runs crimson with iron-rich bacteria. Bioluminescent predators hunt in the shallows. The air shimmers with toxic pollen.',
        warnings: ['Do not enter the water', 'Travel on elevated paths only', 'Light attracts predators']
      },
      'outpost-theta': {
        name: 'Outpost Theta',
        subtitle: 'Research Outpost',
        contamination: '15%',
        threat: 'LOW',
        resources: 'Specialized - Research data, suppressants',
        survivors: '~120 researchers',
        description: 'A forward research station studying mutation patterns. Home to the best geneticists in the wastes. Trade your samples for suppressants and knowledge.',
        warnings: ['Schedule visits in advance', 'Do not bring unstable mutants inside']
      }
    };
    
    this.setupZoneInteractions();
    this.setupClosePanel();
  },
  
  setupZoneInteractions() {
    this.zones.forEach(zone => {
      zone.addEventListener('click', (e) => {
        const zoneKey = zone.dataset.zone;
        this.showZoneInfo(zoneKey);
      });
      
      zone.addEventListener('mouseenter', () => {
        const areas = zone.querySelectorAll('.zone-area');
        areas.forEach(area => {
          area.style.filter = 'brightness(1.5)';
        });
      });
      
      zone.addEventListener('mouseleave', () => {
        const areas = zone.querySelectorAll('.zone-area');
        areas.forEach(area => {
          area.style.filter = '';
        });
      });
    });
  },
  
  showZoneInfo(zoneKey) {
    const data = this.zoneData[zoneKey];
    if (!data) return;
    
    const nameEl = this.panel.querySelector('.panel-zone-name');
    const contaminationEl = document.getElementById('panel-contamination');
    const threatEl = document.getElementById('panel-threat');
    const resourcesEl = document.getElementById('panel-resources');
    const survivorsEl = document.getElementById('panel-survivors');
    const descriptionEl = document.getElementById('panel-description');
    const warningsEl = document.getElementById('panel-warnings');
    
    nameEl.textContent = data.name;
    contaminationEl.textContent = data.contamination;
    threatEl.textContent = data.threat;
    resourcesEl.textContent = data.resources;
    survivorsEl.textContent = data.survivors;
    descriptionEl.textContent = data.description;
    
    // Update warnings
    warningsEl.innerHTML = '';
    data.warnings.forEach(warning => {
      const tag = document.createElement('span');
      tag.className = 'warning-tag';
      tag.textContent = `⚠ ${warning}`;
      warningsEl.appendChild(tag);
    });
    
    // Set threat color
    const threatColors = {
      'LOW': '#39ff14',
      'MODERATE': '#ccff00',
      'DANGEROUS': '#f97316',
      'CRITICAL': '#ff2244',
      'ANOMALY': '#ff00ff'
    };
    threatEl.style.color = threatColors[data.threat] || '#e8f5ef';
    
    // Show panel
    this.panel.classList.add('active');
  },
  
  setupClosePanel() {
    this.closeBtn.addEventListener('click', () => {
      this.panel.classList.remove('active');
    });
  }
};

// ===== TECH TREE SYSTEM =====
const TechTreeSystem = {
  init() {
    this.dnaPoints = 15;
    this.dnaDisplay = document.getElementById('dna-points');
    this.nodes = document.querySelectorAll('.tech-node');
    
    // Track unlocked nodes
    this.unlockedNodes = new Set();
    
    this.setupNodeInteractions();
    this.updateDNA();
  },
  
  setupNodeInteractions() {
    this.nodes.forEach(node => {
      node.addEventListener('click', () => {
        const isLocked = node.classList.contains('locked');
        const tier = parseInt(node.dataset.tier);
        const cost = parseInt(node.querySelector('.node-cost').textContent);
        const branch = node.closest('.tech-branch').dataset.branch;
        
        if (isLocked) {
          // Check if prerequisite is met
          const prerequisite = this.getPrerequisite(branch, tier);
          
          if (prerequisite && !this.unlockedNodes.has(prerequisite)) {
            this.shakeNode(node);
            return;
          }
          
          if (this.dnaPoints >= cost) {
            this.unlockNode(node, cost);
          } else {
            this.shakeNode(node);
          }
        }
      });
      
      // Hover effect
      node.addEventListener('mouseenter', () => {
        if (!node.classList.contains('locked')) {
          node.querySelector('.node-core').style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.6)';
        }
      });
      
      node.addEventListener('mouseleave', () => {
        node.querySelector('.node-core').style.boxShadow = '';
      });
    });
  },
  
  getPrerequisite(branch, tier) {
    if (tier <= 1) return null;
    return `${branch}-tier-${tier - 1}`;
  },
  
  unlockNode(node, cost) {
    // Deduct DNA
    this.dnaPoints -= cost;
    this.updateDNA();
    
    // Mark as unlocked
    node.classList.remove('locked');
    node.classList.add('unlocked');
    this.unlockedNodes.add(node.closest('.tech-branch').dataset.branch + '-tier-' + node.dataset.tier);
    
    // Visual feedback
    const core = node.querySelector('.node-core');
    core.style.background = '#00ffcc';
    core.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.8)';
    
    // Pulse animation
    node.style.animation = 'bio-pulse 1s ease-in-out';
    setTimeout(() => {
      node.style.animation = '';
    }, 1000);
    
    // Unlock next tier if available
    const nextTier = this.nodes.find(n => {
      const branch = n.closest('.tech-branch').dataset.branch;
      const tier = parseInt(n.dataset.tier);
      return branch === node.closest('.tech-branch').dataset.branch && tier === parseInt(node.dataset.tier) + 1;
    });
    
    if (nextTier) {
      nextTier.classList.remove('locked');
      nextTier.style.opacity = '0.8';
    }
  },
  
  shakeNode(node) {
    node.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      node.style.animation = '';
    }, 500);
  },
  
  updateDNA() {
    this.dnaDisplay.textContent = this.dnaPoints;
  }
};

// ===== MODAL SYSTEM =====
const ModalSystem = {
  init() {
    this.overlay = document.getElementById('modal-overlay');
    this.body = document.getElementById('modal-body');
    this.closeBtn = this.overlay.querySelector('.modal-close');
    
    this.setupClose();
    this.setupEscape();
  },
  
  open(content) {
    this.body.innerHTML = content;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  
  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  setupClose() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  },
  
  setupEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }
};

// ===== BREATHING SYSTEM =====
const BreathingSystem = {
  init() {
    // Add breathing effect to mutation cards
    const cards = document.querySelectorAll('.mutation-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add bio-pulse to interactive elements
    const interactiveElements = document.querySelectorAll('.btn-primary, .tech-node.unlocked');
    interactiveElements.forEach(el => {
      el.classList.add('bio-pulse');
    });
  }
};

// ===== UTILITY FUNCTIONS =====

// Add shake keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  /* Mobile nav open state */
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(10, 15, 13, 0.98);
      padding: var(--space-lg);
      gap: var(--space-md);
      border-bottom: 1px solid rgba(0, 255, 204, 0.2);
    }
  }
  
  .nav-toggle.active .toggle-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-toggle.active .toggle-line:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle.active .toggle-line:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;
document.head.appendChild(styleSheet);

// ===== HERO BUTTON INTERACTIONS =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.dataset.action;
    
    if (action === 'enter') {
      // Scroll to mutations
      document.getElementById('mutations').scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'dossier') {
      ModalSystem.open(`
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: var(--space-md); color: var(--glow-bio);">CLASSIFIED DOSSIER</h2>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-md);">
          <strong style="color: var(--text-primary);">SUBJECT:</strong> Genesis Wastes Biopunk RPG<br>
          <strong style="color: var(--text-primary);">CLEARANCE:</strong> Omega Level<br>
          <strong style="color: var(--text-primary);">STATUS:</strong> Active Campaign<br><br>
          The year is 2147. Eight years after the Great Mutation dissolved the boundary between organism and environment, humanity survives in scattered enclaves. You are a wanderer of the wastes, carrying genetic modifications that make you both powerful and hunted.
        </p>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7;">
          Your choices will determine the fate of the remaining factions. Every mutation has a cost. Every alliance has a price. The wasteland remembers everything.
        </p>
      `);
    }
  });
});

// ===== CARD ACTION BUTTONS =====
document.querySelectorAll('.card-action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.mutation-card');
    const name = card.querySelector('.mutation-name').textContent;
    const description = card.querySelector('.mutation-description').textContent;
    const id = card.querySelector('.mutation-id').textContent;
    
    ModalSystem.open(`
      <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg);">
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${id}</span>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">|</span>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--glow-bio);">SEQUENCE DATA</span>
      </div>
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: var(--space-md); color: var(--text-primary);">${name}</h2>
      <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-lg);">${description}</p>
      <div style="padding: var(--space-md); background: rgba(0, 255, 204, 0.03); border: 1px solid rgba(0, 255, 204, 0.1); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
        <strong style="color: var(--glow-bio);">⚠ WARNING:</strong> Full sequence analysis requires Level 3 bio-containment clearance. Unauthorized access may result in involuntary mutation cascade.
      </div>
    `);
  });
});

// ===== SURVIVAL CARD HOVER EFFECTS =====
document.querySelectorAll('.survival-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const border = card.querySelector('.card-sketch-border');
    if (border) {
      border.style.borderColor = 'rgba(0, 255, 204, 0.3)';
      border.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 204, 0.05)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    const border = card.querySelector('.card-sketch-border');
    if (border) {
      border.style.borderColor = '';
      border.style.boxShadow = '';
    }
  });
});

// ===== FILTER BUTTON ANIMATIONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Add a subtle pulse to the clicked button
    this.style.transform = 'scale(1.05)';
    setTimeout(() => {
      this.style.transform = '';
    }, 200);
  });
});

// ===== TECH NODE TOOLTIP =====
document.querySelectorAll('.tech-node').forEach(node => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tech-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(10, 15, 13, 0.95);
    border: 1px solid rgba(0, 255, 204, 0.2);
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-secondary);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateY(5px);
    transition: all 0.2s ease;
    z-index: 10;
  `;
  tooltip.textContent = node.classList.contains('locked') ? 'Requires prerequisite' : 'Click to unlock';
  
  node.style.position = 'relative';
  node.appendChild(tooltip);
  
  node.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
  });
  
  node.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(5px)';
  });
});

// ===== PARALLAX EFFECT FOR BIO MASSES =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const bioMasses = document.querySelectorAll('.bio-mass');
  
  bioMasses.forEach((mass, index) => {
    const speed = 0.1 + (index * 0.05);
    mass.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ===== DYNAMIC STATUS INDICATOR =====
const statusDot = document.querySelector('.status-dot');
if (statusDot) {
  // Randomly change status message occasionally
  const statuses = [
    { text: 'SUBJECT: ACTIVE', color: '#39ff14' },
    { text: 'MUTATION: STABLE', color: '#00ffcc' },
    { text: 'THREAT: ELEVATED', color: '#f97316' }
  ];
  
  setInterval(() => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const statusText = statusDot.parentElement.querySelector('.status-text');
    if (statusText) {
      statusText.style.transition = 'opacity 0.3s ease';
      statusText.style.opacity = '0';
      
      setTimeout(() => {
        statusText.textContent = randomStatus.text;
        statusText.style.opacity = '1';
        statusDot.style.background = randomStatus.color;
        statusDot.style.boxShadow = `0 0 10px ${randomStatus.color}`;
      }, 300);
    }
  }, 10000);
}

// ===== CONSOLE EASTER EGG =====
console.log('%c⚠ GENESIS WASTES ⚠', 'color: #00ffcc; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ffcc;');
console.log('%cThis terminal is contaminated. Proceed at your own risk.', 'color: #39ff14; font-size: 12px;');
console.log('%cDr. Voss was right. We are being rewritten.', 'color: #ff2244; font-size: 10px; font-style: italic;');
/* ============================================ DEADWOOD TERRITORY BOUNTY BOARD Interactive Western Experience ============================================ */

// --- Dust Particle System ---
class DustParticleSystem {
  constructor() {
    this.container = document.getElementById('dustOverlay');
    this.particles = [];
    this.maxParticles = 50;
    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.spawnParticle();
    }
  }

  spawnParticle() {
    const particle = document.createElement('div');
    particle.className = 'dust-particle';
    
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.2;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `-10px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = opacity;
    
    this.container.appendChild(particle);
    this.particles.push(particle);
  }

  animate() {
    setInterval(() => {
      this.particles.forEach((particle, index) => {
        const rect = particle.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
          particle.remove();
          this.particles.splice(index, 1);
          this.spawnParticle();
        }
      });
    }, 1000);
  }
}

// --- Tumbleweed Controller ---
class TumbleweedController {
  constructor() {
    this.container = document.getElementById('tumbleweedContainer');
    this.tumbleweed = document.getElementById('tumbleweed');
    this.isRolling = true;
    this.speed = 25;
    this.init();
  }

  init() {
    this.addInteractivity();
    this.randomizePath();
  }

  addInteractivity() {
    this.tumbleweed.addEventListener('click', () => {
      this.triggerSpeedBoost();
    });

    document.addEventListener('mousemove', (e) => {
      const mouseY = e.clientY / window.innerHeight;
      const newTop = 20 + (mouseY * 30);
      this.container.style.top = `${newTop}%`;
    });
  }

  triggerSpeedBoost() {
    this.container.style.animationDuration = '10s';
    this.tumbleweed.style.animationDuration = '0.5s';
    
    setTimeout(() => {
      this.container.style.animationDuration = `${this.speed}s`;
      this.tumbleweed.style.animationDuration = '2s';
    }, 3000);
  }

  randomizePath() {
    setInterval(() => {
      if (Math.random() > 0.7) {
        const newTop = 15 + Math.random() * 30;
        this.container.style.top = `${newTop}%`;
      }
    }, 5000);
  }
}

// --- Revolver Navigation ---
class RevolverNavigation {
  constructor() {
    this.cylinder = document.querySelector('.revolver-cylinder');
    this.chambers = document.querySelectorAll('.chamber');
    this.trigger = document.querySelector('.revolver-trigger');
    this.sections = ['postersSection', 'reward-tiers-section', 'dispatch-section'];
    this.currentChamber = 5; // Start at last chamber (active)
    this.isSpinning = false;
    
    this.init();
  }

  init() {
    this.chambers.forEach(chamber => {
      chamber.addEventListener('click', (e) => {
        e.stopPropagation();
        this.spinToChamber(parseInt(chamber.dataset.chamber));
      });
    });

    this.trigger.addEventListener('click', () => {
      this.spinCylinder();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        this.spinCylinder();
      }
    });
  }

  spinCylinder() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    
    // Randomize active chamber
    const randomChamber = Math.floor(Math.random() * 6) + 1;
    this.spinToChamber(randomChamber);
    
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }

  spinToChamber(chamberNumber) {
    // Remove active class from all
    this.chambers.forEach(ch => ch.classList.remove('active'));
    
    // Add active class to selected
    const targetChamber = document.querySelector(`[data-chamber="${chamberNumber}"]`);
    if (targetChamber) {
      targetChamber.classList.add('active');
      
      // Add spin animation
      this.cylinder.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        this.cylinder.style.transform = 'rotate(0deg)';
      }, 500);
      
      // Navigate to corresponding section
      this.navigateToSection(chamberNumber);
    }
  }

  navigateToSection(chamberNumber) {
    const sectionMap = {
      1: 'postersSection',
      2: 'reward-tiers-section',
      3: 'dispatch-section',
      4: 'postersSection',
      5: 'reward-tiers-section',
      6: 'dispatch-section'
    };
    
    const sectionId = sectionMap[chamberNumber];
    const section = document.getElementById(sectionId);
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Flash effect on section
      section.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
      setTimeout(() => {
        section.style.boxShadow = '';
      }, 500);
    }
  }
}

// --- Wanted Poster Interactions ---
class WantedPosterController {
  constructor() {
    this.posters = document.querySelectorAll('.wanted-poster');
    this.init();
  }

  init() {
    this.posters.forEach(poster => {
      this.setupPosterInteractions(poster);
    });
  }

  setupPosterInteractions(poster) {
    const posterInner = poster.querySelector('.poster-inner');
    const waxSeal = poster.querySelector('.wax-seal');
    const rewardBox = poster.querySelector('.reward-box');
    
    // Click poster to "tear" it slightly
    poster.addEventListener('click', () => {
      this.tearEffect(poster);
    });
    
    // Hover effects with 3D tilt
    poster.addEventListener('mousemove', (e) => {
      this.tiltEffect(poster, e);
    });
    
    poster.addEventListener('mouseleave', () => {
      this.resetTilt(poster);
    });
    
    // Wax seal click
    if (waxSeal) {
      waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        this.breakSeal(waxSeal);
      });
    }
    
    // Reward box hover
    if (rewardBox) {
      rewardBox.addEventListener('mouseenter', () => {
        this.coinAnimation(rewardBox);
      });
    }
  }

  tearEffect(poster) {
    const curlTop = poster.querySelector('.poster-curl-top');
    const curlBottom = poster.querySelector('.poster-curl-bottom');
    
    curlTop.style.transform = 'rotate(5deg) scale(1.1)';
    curlBottom.style.transform = 'rotate(-5deg) scale(1.1)';
    
    // Add tearing sound effect simulation with visual shake
    poster.style.animation = 'none';
    poster.offsetHeight; // Trigger reflow
    poster.style.animation = 'posterShake 0.5s ease-out';
    
    setTimeout(() => {
      curlTop.style.transform = '';
      curlBottom.style.transform = '';
    }, 300);
  }

  tiltEffect(poster, e) {
    const rect = poster.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    const posterInner = poster.querySelector('.poster-inner');
    posterInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  resetTilt(poster) {
    const posterInner = poster.querySelector('.poster-inner');
    posterInner.style.transform = '';
  }

  breakSeal(seal) {
    seal.style.transform = 'rotate(-15deg) scale(1.2)';
    seal.style.opacity = '0.7';
    
    // Create broken seal particles
    for (let i = 0; i < 8; i++) {
      this.createSealParticle(seal, i);
    }
    
    setTimeout(() => {
      seal.style.transform = 'rotate(-15deg) scale(1)';
      seal.style.opacity = '1';
    }, 500);
  }

  createSealParticle(seal, index) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#8b0000';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    const rect = seal.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(particle);
    
    const angle = (index / 8) * Math.PI * 2;
    const velocity = 50 + Math.random() * 50;
    const destinationX = Math.cos(angle) * velocity;
    const destinationY = Math.sin(angle) * velocity;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => particle.remove();
  }

  coinAnimation(rewardBox) {
    const coins = rewardBox.querySelectorAll('.coin');
    coins.forEach((coin, index) => {
      coin.style.animation = `coinSpin 0.6s ease-out ${index * 0.1}s`;
    });
    
    setTimeout(() => {
      coins.forEach(coin => {
        coin.style.animation = '';
      });
    }, 1000);
  }
}

// --- Saloon Door Page Transition ---
class SaloonDoorTransition {
  constructor() {
    this.doors = [];
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.createDoors();
    this.setupNavigation();
  }

  createDoors() {
    const leftDoor = document.createElement('div');
    const rightDoor = document.createElement('div');
    
    [leftDoor, rightDoor].forEach((door, index) => {
      door.className = 'saloon-door';
      door.style.cssText = `
        position: fixed;
        top: 0;
        width: 50%;
        height: 100vh;
        background: linear-gradient(90deg, #5c3a21 0%, #8b5a2b 50%, #5c3a21 100%);
        z-index: 10000;
        pointer-events: none;
        transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
      `;
      
      if (index === 0) {
        door.style.left = '0';
        door.style.transformOrigin = 'left center';
      } else {
        door.style.right = '0';
        door.style.transformOrigin = 'right center';
      }
      
      // Add wood grain texture
      door.style.backgroundImage = `
        repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px),
        linear-gradient(180deg, #5c3a21 0%, #8b5a2b 50%, #5c3a21 100%)
      `;
      
      // Add door handle
      const handle = document.createElement('div');
      handle.style.cssText = `
        position: absolute;
        top: 50%;
        width: 20px;
        height: 60px;
        background: linear-gradient(90deg, #2a1810 0%, #5c3a21 50%, #2a1810 100%);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      `;
      
      if (index === 0) {
        handle.style.right = '20px';
      } else {
        handle.style.left = '20px';
      }
      
      door.appendChild(handle);
      document.body.appendChild(door);
      this.doors.push(door);
    });
  }

  setupNavigation() {
    // Intercept all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.transitionTo(targetId);
      });
    });
    
    // Revolver navigation trigger
    document.querySelector('.revolver-trigger')?.addEventListener('click', () => {
      this.transitionTo('postersSection');
    });
  }

  transitionTo(targetId) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Open doors
    this.doors[0].style.transform = 'perspective(1000px) rotateY(-110deg)';
    this.doors[1].style.transform = 'perspective(1000px) rotateY(110deg)';
    
    // Navigate after doors open
    setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'auto' });
      }
      
      // Close doors
      setTimeout(() => {
        this.doors[0].style.transform = 'perspective(1000px) rotateY(0deg)';
        this.doors[1].style.transform = 'perspective(1000px) rotateY(0deg)';
        
        setTimeout(() => {
          this.isTransitioning = false;
        }, 800);
      }, 200);
    }, 800);
  }
}

// --- Sheriff's Dispatch Log Controller ---
class DispatchLogController {
  constructor() {
    this.logEntries = document.querySelectorAll('.log-entry');
    this.init();
  }

  init() {
    this.setupFiltering();
    this.setupAnimations();
  }

  setupFiltering() {
    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'dispatch-filters';
    filterContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    `;
    
    const filters = [
      { label: 'ALL', class: 'all', priority: null },
      { label: 'URGENT', class: 'high', priority: 'high' },
      { label: 'ROUTINE', class: 'medium', priority: 'medium' },
      { label: 'INFO', class: 'low', priority: 'low' }
    ];
    
    filters.forEach(filter => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.textContent = filter.label;
      button.style.cssText = `
        font-family: 'Special Elite', monospace;
        padding: 8px 16px;
        background: rgba(212, 184, 150, 0.1);
        border: 1px solid rgba(212, 184, 150, 0.3);
        color: var(--parchment-light);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.85rem;
      `;
      
      button.addEventListener('click', () => {
        this.filterEntries(filter.priority);
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.style.background = 'rgba(212, 184, 150, 0.1)';
          btn.style.borderColor = 'rgba(212, 184, 150, 0.3)';
        });
        button.style.background = 'rgba(212, 175, 55, 0.2)';
        button.style.borderColor = 'var(--gold)';
      });
      
      filterContainer.appendChild(button);
    });
    
    const dispatchSection = document.querySelector('.dispatch-section');
    const sectionHeader = dispatchSection.querySelector('.section-header');
    dispatchSection.insertBefore(filterContainer, dispatchSection.querySelector('.dispatch-log'));
  }

  filterEntries(priority) {
    this.logEntries.forEach(entry => {
      const entryPriority = entry.querySelector('.entry-priority');
      const priorityClass = entryPriority?.className.split(' ')[1] || 'low';
      
      if (!priority || priorityClass === priority) {
        entry.style.display = 'block';
        entry.style.animation = 'fadeInUp 0.5s ease-out';
      } else {
        entry.style.display = 'none';
      }
    });
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
      });
    }, { threshold: 0.1 });
    
    this.logEntries.forEach(entry => {
      entry.style.opacity = '0';
      entry.style.transform = 'translateY(20px)';
      observer.observe(entry);
    });
  }
}

// --- Parallax and Scroll Effects ---
class ParallaxController {
  constructor() {
    this.woodenBoard = document.querySelector('.wooden-board');
    this.header = document.querySelector('.board-header');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.updateParallax();
    });
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Parallax effect on header
    if (this.header) {
      const headerOffset = scrolled * 0.3;
      this.header.style.transform = `translateY(${headerOffset}px)`;
      this.header.style.opacity = 1 - (scrolled * 0.002);
    }
    
    // Update dust particle intensity based on scroll
    const dustOverlay = document.getElementById('dustOverlay');
    if (dustOverlay) {
      const intensity = Math.min(scrolled * 0.0001, 0.3);
      dustOverlay.style.opacity = 0.3 + intensity;
    }
  }
}

// --- Sound Effects Controller (Optional Enhancement) ---
class SoundEffectsController {
  constructor() {
    this.enabled = false; // Set to true to enable sounds
    this.audioContext = null;
    this.init();
  }

  init() {
    if (this.enabled) {
      this.setupAudio();
    }
    
    // Add sound toggle button
    this.createSoundToggle();
  }

  createSoundToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'sound-toggle';
    toggle.innerHTML = '🔊';
    toggle.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(92, 58, 33, 0.8);
      border: 2px solid var(--gold);
      color: var(--parchment-light);
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    toggle.addEventListener('click', () => {
      this.enabled = !this.enabled;
      toggle.innerHTML = this.enabled ? '🔊' : '🔇';
      if (this.enabled) {
        this.playClickSound();
      }
    });
    
    document.body.appendChild(toggle);
  }

  setupAudio() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  playClickSound() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playTumbleweedSound() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all controllers
  const dustSystem = new DustParticleSystem();
  const tumbleweed = new TumbleweedController();
  const revolverNav = new RevolverNavigation();
  const posterController = new WantedPosterController();
  const saloonDoors = new SaloonDoorTransition();
  const dispatchLog = new DispatchLogController();
  const parallax = new ParallaxController();
  const soundEffects = new SoundEffectsController();
  
  // Add custom CSS for dynamic elements
  const dynamicStyles = document.createElement('style');
  dynamicStyles.textContent = `
    @keyframes posterShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes coinSpin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    
    .filter-btn:hover {
      background: rgba(212, 175, 55, 0.2) !important;
      border-color: var(--gold) !important;
      transform: translateY(-2px);
    }
    
    .saloon-door {
      backface-visibility: hidden;
    }
    
    .sound-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    }
    
    /* Smooth scroll offset for fixed elements */
    html {
      scroll-padding-top: 100px;
    }
  `;
  document.head.appendChild(dynamicStyles);
  
  // Console Easter Egg
  console.log('%c🤠 Wanted: JavaScript Developer', 'font-family: Rye, cursive; font-size: 20px; color: #d4af37;');
  console.log('%cReward: Immersive Web Experience', 'font-family: Special Elite, monospace; color: #c4a574;');
  console.log('%c"Build clean code, ride dirty"', 'font-style: italic; color: #8b5a2b;');
  
  // Performance optimization: Pause animations when tab is not visible
  document.addEventListener('visibilitychange', () => {
    const dustParticles = document.querySelectorAll('.dust-particle');
    const tumbleweedEl = document.querySelector('.tumbleweed');
    
    if (document.hidden) {
      dustParticles.forEach(p => p.style.animationPlayState = 'paused');
      tumbleweedEl.style.animationPlayState = 'paused';
    } else {
      dustParticles.forEach(p => p.style.animationPlayState = 'running');
      tumbleweedEl.style.animationPlayState = 'running';
    }
  });
});

// --- Service Worker Registration for Offline Support (Optional) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js').catch(() => {});
    // Service worker would cache assets for offline bounty board viewing
  });
}
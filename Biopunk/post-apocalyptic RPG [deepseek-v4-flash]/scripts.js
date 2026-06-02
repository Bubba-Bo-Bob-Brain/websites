document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // === Particle System ===
  const particlesContainer = document.getElementById('particles');
  const particleCount = 40;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: radial-gradient(circle, rgba(46, 204, 113, ${0.2 + Math.random() * 0.4}), transparent);
      border-radius: 50%;
      pointer-events: none;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    particlesContainer.appendChild(particle);
    
    particles.push({
      el: particle,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: parseFloat(particle.style.width),
      life: Math.random() * Math.PI * 2
    });
  }

  function animateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.02;
      
      if (p.y < -10) {
        p.y = window.innerHeight + 10;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      
      const pulse = Math.sin(p.life) * 0.3 + 0.7;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${pulse})`;
      p.el.style.opacity = (0.2 + Math.random() * 0.3) * pulse;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // === Cursor Trail ===
  const cursor = document.getElementById('cursorTrail');
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    const size = 15 + Math.sin(Date.now() * 0.003) * 5;
    cursor.style.width = size + 'px';
    cursor.style.height = size + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // === Animated Stats Counter ===
  const statValues = document.querySelectorAll('.stat-value');
  
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(stat => statObserver.observe(stat));

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 60);
    const duration = 2000;
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }
    update();
  }

  // === Mutation Filter ===
  const filterButtons = document.querySelectorAll('.filter-spore');
  const mutationCards = document.querySelectorAll('.mutation-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      mutationCards.forEach(card => {
        const type = card.getAttribute('data-type');
        
        if (filter === 'all' || type === filter) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            card.style.display = 'block';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // === Mutation Card Hover Effects ===
  mutationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const throb = card.querySelector('.card-throb');
      if (throb) {
        throb.style.animationDuration = '1s';
        throb.style.background = 'radial-gradient(circle, rgba(57, 255, 122, 0.4), transparent)';
      }
    });

    card.addEventListener('mouseleave', () => {
      const throb = card.querySelector('.card-throb');
      if (throb) {
        throb.style.animationDuration = '3s';
        throb.style.background = 'radial-gradient(circle, var(--bio-dim), transparent)';
      }
    });
  });

  // === Tech Tree Node Interaction ===
  const techNodes = document.querySelectorAll('.tech-node');
  
  techNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      const isActive = node.classList.contains('active');
      
      if (!isActive) {
        techNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        
        const core = node.querySelector('.node-core');
        core.style.borderColor = 'var(--bio-pulse)';
        core.style.boxShadow = '0 0 40px rgba(46, 204, 113, 0.3)';
        
        // Update progress
        const progressFill = document.getElementById('progressFill');
        const progressValue = document.querySelector('.progress-value');
        const progress = (index + 1) * 20;
        
        progressFill.style.width = progress + '%';
        progressValue.textContent = `${progress}% — Strain Level ${index + 1}`;
        
        // Disable previous nodes
        techNodes.forEach((n, i) => {
          if (i < index) {
            n.style.opacity = '0.6';
          }
        });
      }
    });

    node.addEventListener('mouseenter', () => {
      const pulse = node.querySelector('.node-pulse');
      if (pulse) {
        pulse.style.animationDuration = '0.8s';
        pulse.style.opacity = '0.6';
      }
    });

    node.addEventListener('mouseleave', () => {
      const pulse = node.querySelector('.node-pulse');
      if (pulse) {
        pulse.style.animationDuration = '2s';
        pulse.style.opacity = '0.3';
      }
    });
  });

  // === Contamination Map Hotspot Interaction ===
  const hotspots = document.querySelectorAll('.contamination-hotspot');
  
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      const label = hotspot.querySelector('.hotspot-label');
      const ring = hotspot.querySelector('.hotspot-ring');
      
      if (label) {
        label.style.color = 'var(--bio-pulse)';
        label.style.fontWeight = '600';
        
        setTimeout(() => {
          label.style.color = '';
          label.style.fontWeight = '';
        }, 2000);
      }
      
      if (ring) {
        ring.style.transform = 'scale(2)';
        ring.style.opacity = '0';
        
        setTimeout(() => {
          ring.style.transform = '';
          ring.style.opacity = '';
        }, 500);
      }
    });

    // Add data info display
    hotspot.addEventListener('mouseenter', () => {
      const level = hotspot.getAttribute('data-level');
      const label = hotspot.querySelector('.hotspot-label');
      
      const infoMap = {
        critical: { threat: 'EXTREME', bio: '2,400 spores/m³' },
        high: { threat: 'SEVERE', bio: '1,200 spores/m³' },
        medium: { threat: 'ELEVATED', bio: '600 spores/m³' },
        low: { threat: 'MODERATE', bio: '150 spores/m³' }
      };
      
      const info = infoMap[level];
      if (info && label) {
        label.textContent = `${label.textContent} — ${info.threat} | ${info.bio}`;
      }
    });

    hotspot.addEventListener('mouseleave', () => {
      const label = hotspot.querySelector('.hotspot-label');
      if (label) {
        const originalText = label.textContent.split(' — ')[0];
        label.textContent = originalText;
      }
    });
  });

  // === Nav Smooth Scroll ===
  const navButtons = document.querySelectorAll('.nav-tendril');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.getAttribute('data-section');
      const target = document.getElementById(section);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Flash effect on section
        target.style.borderColor = 'var(--bio-pulse)';
        target.style.boxShadow = 'inset 0 0 30px rgba(46, 204, 113, 0.1)';
        
        setTimeout(() => {
          target.style.borderColor = '';
          target.style.boxShadow = '';
        }, 1500);
      }
    });
  });

  // === Header Scroll Effect ===
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.background = 'rgba(10, 8, 8, 0.98)';
      header.style.borderBottom = '1px solid var(--border-glow)';
    } else {
      header.style.background = 'linear-gradient(180deg, rgba(10, 8, 8, 0.95) 0%, rgba(10, 8, 8, 0) 100%)';
      header.style.borderBottom = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // === Section Reveal Animation ===
  const sections = document.querySelectorAll('.section-cyst');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target.querySelector('.section-title');
        const cards = entry.target.querySelectorAll('.mutation-card, .guide-item');
        
        if (title) {
          title.style.opacity = '0';
          title.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            title.style.transition = 'all 0.8s var(--transition-organic)';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }, 100);
        }
        
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(40px)';
          
          setTimeout(() => {
            card.style.transition = 'all 0.6s var(--transition-organic)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 200 + i * 100);
        });
        
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => sectionObserver.observe(section));

  // === Hero Glyph Breathing Animation Control ===
  const heroGlyph = document.querySelector('.hero-glyph');
  if (heroGlyph) {
    let breathPhase = 0;
    
    setInterval(() => {
      breathPhase = (breathPhase + 1) % 4;
      
      const scales = [1, 1.08, 1, 0.95];
      const opacities = [0.6, 1, 0.6, 0.4];
      
      heroGlyph.style.transform = `scale(${scales[breathPhase]})`;
      heroGlyph.style.opacity = opacities[breathPhase];
    }, 2000);
  }

  // === Tech Tree Initial State ===
  const firstNode = document.querySelector('.tech-node');
  if (firstNode) {
    firstNode.classList.add('active');
    const core = firstNode.querySelector('.node-core');
    if (core) {
      core.style.borderColor = 'var(--bio-pulse)';
      core.style.boxShadow = '0 0 40px rgba(46, 204, 113, 0.3)';
    }
  }

  // === Window Resize Handler ===
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      particles.forEach(p => {
        if (p.x > window.innerWidth) p.x = window.innerWidth - 10;
        if (p.y > window.innerHeight) p.y = window.innerHeight - 10;
      });
    }, 250);
  });

  // === Ambient Sound Simulation (Visual Only) ===
  const createSoundWave = () => {
    const sections = document.querySelectorAll('.section-cyst');
    sections.forEach(section => {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--bio-dim), transparent);
        opacity: ${0.05 + Math.random() * 0.1};
        animation: soundWave ${1 + Math.random() * 2}s ease-in-out infinite;
      `;
      section.style.position = 'relative';
      section.appendChild(wave);
      
      setTimeout(() => wave.remove(), 3000);
    });
  };

  // Create occasional sound wave effects
  setInterval(createSoundWave, 5000);

  // === Contamination Pulse Effect ===
  const mapTerrain = document.getElementById('contaminationMap');
  if (mapTerrain) {
    setInterval(() => {
      const pulse = document.createElement('div');
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      
      pulse.style.cssText = `
        position: absolute;
        top: ${y}%;
        left: ${x}%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(46, 204, 113, 0.1), transparent);
        pointer-events: none;
        animation: hotspotPulse 2s ease-out forwards;
      `;
      
      mapTerrain.appendChild(pulse);
      setTimeout(() => pulse.remove(), 2000);
    }, 4000);
  }

  console.log('VISCERA — The flesh remembers. The wasteland evolves.');
});
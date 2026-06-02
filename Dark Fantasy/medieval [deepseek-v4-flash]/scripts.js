document.addEventListener('DOMContentLoaded', () => {
  const particleContainer = document.getElementById('particles');
  const beastCards = document.querySelectorAll('.beast-card');
  const mapRegions = document.querySelectorAll('.map-region');
  const torches = document.querySelectorAll('.torch');

  // ===== PARTICLE SYSTEM =====
  class Particle {
    constructor(container) {
      this.container = container;
      this.element = document.createElement('div');
      this.element.className = 'particle';
      this.reset();
      container.appendChild(this.element);
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = window.innerHeight + 20;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 500 + 300;
      this.isGlow = Math.random() > 0.7;

      this.element.style.cssText = `
        position: fixed;
        left: ${this.x}px;
        bottom: 0;
        width: ${this.size}px;
        height: ${this.size}px;
        background: ${this.isGlow ? 'rgba(255, 107, 53, 0.3)' : 'rgba(201, 168, 76, 0.2)'};
        border-radius: 50%;
        pointer-events: none;
        box-shadow: ${this.isGlow ? '0 0 6px rgba(255, 107, 53, 0.2)' : 'none'};
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: ${this.isGlow ? 2 : 1};
      `;
    }

    update() {
      this.life++;
      if (this.life > this.maxLife) {
        this.reset();
        return;
      }

      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;

      this.element.style.left = `${this.x}px`;
      this.element.style.bottom = `${window.innerHeight - this.y}px`;
      this.element.style.opacity = this.opacity;
    }
  }

  const particles = [];
  const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = new Particle(particleContainer);
      particles.push(particle);
    }, i * 200);
  }

  function animateParticles() {
    particles.forEach(particle => particle.update());
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== TORCH FLICKER ENHANCEMENT =====
  function enhanceTorchFlicker() {
    torches.forEach(torch => {
      const flame = torch.querySelector('.flame');
      const glow = torch.querySelector('.glow');
      
      setInterval(() => {
        const intensity = 0.8 + Math.random() * 0.4;
        flame.style.transform = `translateX(-50%) scaleY(${intensity}) rotate(${(Math.random() - 0.5) * 2}deg)`;
        
        const glowIntensity = 0.6 + Math.random() * 0.5;
        glow.style.opacity = glowIntensity;
        glow.style.transform = `translateX(-50%) scale(${0.9 + Math.random() * 0.2})`;
      }, 100 + Math.random() * 200);
    });
  }
  enhanceTorchFlicker();

  // ===== BEAST CARD INTERACTIONS =====
  beastCards.forEach((card, index) => {
    const beastName = card.querySelector('.beast-name');
    const beastEyes = card.querySelectorAll('.beast-eye');
    const skulls = card.querySelectorAll('.skull');

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
      
      beastEyes.forEach(eye => {
        eye.style.transition = 'all 0.3s ease';
        eye.style.fill = '#ff6b35';
        eye.style.filter = 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.8))';
      });

      skulls.forEach((skull, i) => {
        setTimeout(() => {
          skull.style.transform = 'scale(1.3)';
          skull.style.filter = 'drop-shadow(0 0 5px rgba(139, 26, 26, 0.5))';
        }, i * 50);
      });
    });

    card.addEventListener('mouseleave', () => {
      beastEyes.forEach(eye => {
        eye.style.fill = '';
        eye.style.filter = '';
      });

      skulls.forEach(skull => {
        skull.style.transform = '';
        skull.style.filter = '';
      });
    });

    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 200);

      const beastIcon = card.querySelector('.beast-svg');
      if (beastIcon) {
        beastIcon.style.transition = 'all 0.5s ease';
        beastIcon.style.filter = 'drop-shadow(0 0 30px rgba(201, 168, 76, 0.6))';
        setTimeout(() => {
          beastIcon.style.filter = '';
        }, 1000);
      }
    });

    // Stagger entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + index * 400);
  });

  // ===== MAP REGION INTERACTIONS =====
  mapRegions.forEach(region => {
    const marker = region.querySelector('.region-marker');
    const label = region.querySelector('.region-label');

    region.addEventListener('mouseenter', () => {
      marker.style.transform = 'scale(1.5)';
      marker.style.boxShadow = '0 0 30px rgba(139, 26, 26, 0.8)';
      marker.style.background = '#ff6b35';
      
      label.style.color = '#ff6b35';
      label.style.textShadow = '0 0 15px rgba(255, 107, 53, 0.5)';
    });

    region.addEventListener('mouseleave', () => {
      marker.style.transform = '';
      marker.style.boxShadow = '';
      marker.style.background = '';
      label.style.color = '';
      label.style.textShadow = '';
    });

    region.addEventListener('click', () => {
      const regionName = region.dataset.region;
      const regionLabels = {
        'duskwood': 'The Duskwood - A forest where shadows move against the wind, and whispers echo without source.',
        'iron-peaks': 'The Iron Peaks - Mountains that pierce the sky like jagged fangs, home to ancient terrors.',
        'sundered-sea': 'The Sundered Sea - Waters so deep and dark that even light fears to penetrate.'
      };

      const tooltip = document.createElement('div');
      tooltip.className = 'map-tooltip';
      tooltip.textContent = regionLabels[regionName] || 'Unknown territory...';
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(10, 6, 8, 0.95);
        color: #e8dcc8;
        padding: 1rem 1.5rem;
        border: 1px solid #7a6530;
        border-radius: 4px;
        font-family: 'Crimson Text', serif;
        font-size: 0.85rem;
        line-height: 1.5;
        max-width: 280px;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.4s ease;
        z-index: 100;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      `;

      const rect = region.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - 140}px`;
      tooltip.style.top = `${rect.bottom + 15}px`;

      document.body.appendChild(tooltip);

      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      });

      setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
        setTimeout(() => tooltip.remove(), 400);
      }, 3000);
    });
  });

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.prophecy-section, .map-section, .scroll-section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    observer.observe(section);
  });

  // ===== PROPHECY TEXT REVEAL =====
  const prophecyText = document.querySelector('.prophecy-text');
  if (prophecyText) {
    const words = prophecyText.innerHTML.split(' ');
    prophecyText.innerHTML = words.map((word, i) => {
      if (word.includes('<') || word.includes('>')) return word;
      return `<span class="prophecy-word" style="display: inline-block; opacity: 0; transform: translateY(10px); transition: all 0.5s ease; transition-delay: ${i * 0.05}s">${word}</span>`;
    }).join(' ');

    const prophecyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll('.prophecy-word');
          words.forEach((word, i) => {
            setTimeout(() => {
              word.style.opacity = '1';
              word.style.transform = 'translateY(0)';
            }, i * 50);
          });
          prophecyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    prophecyObserver.observe(prophecyText);
  }

  // ===== CURSOR EFFECT =====
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
  `;
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('.beast-card, .map-region, button, a');
    if (target) {
      cursorGlow.style.width = '40px';
      cursorGlow.style.height = '40px';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(201, 168, 76, 0.2) 0%, transparent 70%)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('.beast-card, .map-region, button, a');
    if (target) {
      cursorGlow.style.width = '20px';
      cursorGlow.style.height = '20px';
      cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)';
    }
  });

  // ===== AMBIENT SOUND INDICATOR =====
  const ambientIndicator = document.createElement('div');
  ambientIndicator.className = 'ambient-indicator';
  ambientIndicator.innerHTML = '♫';
  ambientIndicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 1.5rem;
    color: rgba(201, 168, 76, 0.3);
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
    animation: ambient-pulse 4s ease-in-out infinite;
  `;
  document.body.appendChild(ambientIndicator);

  ambientIndicator.addEventListener('mouseenter', () => {
    ambientIndicator.style.color = 'rgba(201, 168, 76, 0.6)';
    ambientIndicator.style.transform = 'scale(1.2)';
  });

  ambientIndicator.addEventListener('mouseleave', () => {
    ambientIndicator.style.color = 'rgba(201, 168, 76, 0.3)';
    ambientIndicator.style.transform = 'scale(1)';
  });

  ambientIndicator.addEventListener('click', () => {
    ambientIndicator.style.color = '#ff6b35';
    setTimeout(() => {
      ambientIndicator.style.color = 'rgba(201, 168, 76, 0.3)';
    }, 1000);
  });

  // ===== RESIZE HANDLER =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newParticleCount = Math.min(40, Math.floor(window.innerWidth / 30));
      while (particles.length > newParticleCount) {
        const particle = particles.pop();
        particle.element.remove();
      }
      while (particles.length < newParticleCount) {
        const particle = new Particle(particleContainer);
        particles.push(particle);
      }
    }, 250);
  });

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      const prophecySection = document.querySelector('.prophecy-section');
      if (prophecySection) {
        prophecySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (e.key === 'b' || e.key === 'B') {
      const bestiarySection = document.querySelector('.bestiary-section');
      if (bestiarySection) {
        bestiarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.key === 'm' || e.key === 'M') {
      const mapSection = document.querySelector('.map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  console.log('%c Codex of Shadowed Beasts ', 'background: #1a1215; color: #c9a84c; font-size: 16px; padding: 10px; border: 2px solid #c9a84c;');
  console.log('%c Press P - Prophecy | B - Bestiary | M - Map ', 'background: #0a0608; color: #8b1a1a; padding: 5px; font-style: italic;');
});
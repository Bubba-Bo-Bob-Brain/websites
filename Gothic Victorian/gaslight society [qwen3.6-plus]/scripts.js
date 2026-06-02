/* =========================================
   THE ORDER OF THE OBSIDIAN VEIL
   Interactive Scripts
   ========================================= */

(function() {
  'use strict';

  // ==========================================
  // 1. ENVELOPE OPENING SEQUENCE
  // ==========================================
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const waxSeal = document.getElementById('wax-seal');
  const envelopeFlap = document.getElementById('envelope-flap');
  const mainContent = document.getElementById('main-content');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Crack the wax seal
    waxSeal.classList.add('cracked');

    // Open the flap after a brief delay
    setTimeout(() => {
      envelopeFlap.style.transform = 'rotateX(180deg)';
    }, 300);

    // Reveal main content
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      mainContent.classList.add('revealed');
      
      // Initialize ambient effects after reveal
      initAmbientEffects();
      initScrollAnimations();
    }, 1200);
  }

  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelopeOverlay.addEventListener('click', () => {
    openEnvelope();
  });

  // ==========================================
  // 2. GRANDFATHER CLOCK
  // ==========================================
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');

  function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Smooth second hand
    const secondDegrees = (seconds + milliseconds / 1000) * 6;
    // Smooth minute hand
    const minuteDegrees = (minutes + seconds / 60) * 6;
    // Smooth hour hand
    const hourDegrees = (hours + minutes / 60) * 30;

    secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;

    requestAnimationFrame(updateClock);
  }

  updateClock();

  // ==========================================
  // 3. AMBIENT SMOKE PARTICLES
  // ==========================================
  function initAmbientEffects() {
    const smokeContainer = document.getElementById('smoke-container');
    if (!smokeContainer) return;

    function createSmokeParticle() {
      const particle = document.createElement('div');
      particle.className = 'smoke-particle';
      
      const size = Math.random() * 150 + 80;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = '-100px';
      particle.style.animationDuration = `${Math.random() * 10 + 12}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      smokeContainer.appendChild(particle);

      // Remove particle after animation completes
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 22000);
    }

    // Create initial batch
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createSmokeParticle(), i * 1500);
    }

    // Continuously create particles
    setInterval(createSmokeParticle, 3000);

    // Gaslight flicker enhancement
    enhanceGaslightFlicker();
  }

  // ==========================================
  // 4. ENHANCED GASLIGHT FLICKER
  // ==========================================
  function enhanceGaslightFlicker() {
    const gaslight = document.getElementById('gaslight');
    if (!gaslight) return;

    function flicker() {
      const baseOpacity = 0.85;
      const variation = (Math.random() - 0.5) * 0.15;
      gaslight.style.opacity = Math.max(0.7, Math.min(1, baseOpacity + variation));
      
      setTimeout(flicker, Math.random() * 200 + 100);
    }

    flicker();
  }

  // ==========================================
  // 5. HIERARCHY CIRCLE NAVIGATION
  // ==========================================
  const circleButtons = document.querySelectorAll('.circle-btn');
  const circleSections = document.querySelectorAll('.circle-section');

  circleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCircle = button.getAttribute('data-circle');

      // Update active button
      circleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Show/hide sections with animation
      circleSections.forEach(section => {
        const sectionCircle = section.getAttribute('data-circle');
        
        if (sectionCircle === targetCircle) {
          section.style.display = 'block';
          // Trigger fade-in animation
          section.style.opacity = '0';
          section.style.transform = 'translateY(20px)';
          
          requestAnimationFrame(() => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          });

          // Smooth scroll to section
          setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        } else {
          section.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 6. SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Stagger children animation
          const children = entry.target.querySelectorAll('.member-card, .schedule-card');
          children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            
            requestAnimationFrame(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
          });
        }
      });
    }, observerOptions);

    // Observe sections
    const sectionsToObserve = document.querySelectorAll('.circle-section, .seance-schedule');
    sectionsToObserve.forEach(section => {
      section.style.opacity = '1';
      section.style.transform = 'none';
      observer.observe(section);
    });
  }

  // ==========================================
  // 7. MEMBER CARD INTERACTIONS
  // ==========================================
  const memberCards = document.querySelectorAll('.member-card');

  memberCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });

    // Click to reveal hidden details (easter egg)
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      
      // Toggle sigil glow
      const sigil = card.querySelector('.member-sigil svg');
      if (sigil) {
        sigil.style.filter = card.classList.contains('revealed') 
          ? 'drop-shadow(0 0 8px rgba(212, 160, 74, 0.6))' 
          : 'none';
      }
    });
  });

  // ==========================================
  // 8. SCHEDULE CARD INTERACTIONS
  // ==========================================
  const scheduleCards = document.querySelectorAll('.schedule-card');

  scheduleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ==========================================
  // 9. DYNAMIC TITLE CHANGE (Easter Egg)
  // ==========================================
  const originalTitle = document.title;
  let titleInterval;

  function startTitleAnimation() {
    const titles = [
      'The Order of the Obsidian Veil',
      'Per Tenebras ad Lucem',
      '⚠ Classified Document',
      'The Eyes of the Order Are Upon You',
      'Do Not Speak Our Name Aloud'
    ];
    let index = 0;

    titleInterval = setInterval(() => {
      document.title = titles[index % titles.length];
      index++;
    }, 8000);
  }

  // Start after envelope is opened
  waxSeal.addEventListener('click', () => {
    setTimeout(startTitleAnimation, 3000);
  });

  // ==========================================
  // 10. KEYBOARD NAVIGATION & EASTER EGGS
  // ==========================================
  document.addEventListener('keydown', (e) => {
    // Press 'O' to open envelope
    if (e.key === 'o' || e.key === 'O') {
      if (!envelopeOpened) {
        openEnvelope();
      }
    }

    // Press 'S' to summon smoke
    if (e.key === 's' || e.key === 'S') {
      if (envelopeOpened) {
        const smokeContainer = document.getElementById('smoke-container');
        if (smokeContainer) {
          for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'smoke-particle';
            particle.style.width = `${Math.random() * 200 + 100}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.bottom = '0px';
            particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
            smokeContainer.appendChild(particle);
          }
        }
      }
    }
  });

  // ==========================================
  // 11. CURSOR TRAIL EFFECT (Subtle)
  // ==========================================
  let cursorTrailEnabled = true;
  const trailElements = [];
  const maxTrailElements = 8;

  document.addEventListener('mousemove', (e) => {
    if (!cursorTrailEnabled || !envelopeOpened) return;

    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.borderRadius = '50%';
    trail.style.background = 'radial-gradient(circle, rgba(212, 160, 74, 0.6), transparent)';
    trail.style.left = `${e.clientX - 2}px`;
    trail.style.top = `${e.clientY - 2}px`;
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    document.body.appendChild(trail);
    trailElements.push(trail);

    // Fade out and remove
    setTimeout(() => {
      trail.style.opacity = '0';
      trail.style.transform = 'scale(2)';
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        const index = trailElements.indexOf(trail);
        if (index > -1) {
          trailElements.splice(index, 1);
        }
      }, 800);
    }, 100);

    // Limit trail elements
    if (trailElements.length > maxTrailElements) {
      const old = trailElements.shift();
      if (old && old.parentNode) {
        old.parentNode.removeChild(old);
      }
    }
  });

  // ==========================================
  // 12. PAGE LOAD INITIALIZATION
  // ==========================================
  window.addEventListener('load', () => {
    // Add subtle animation to envelope on load
    envelopeOverlay.style.opacity = '1';
    
    // Preload check - ensure fonts are loaded
    document.fonts.ready.then(() => {
      console.log('The Order of the Obsidian Veil has been awakened.');
    });
  });

  // ==========================================
  // 13. PERFORMANCE CLEANUP
  // ==========================================
  window.addEventListener('beforeunload', () => {
    // Clean up intervals and observers
    if (titleInterval) clearInterval(titleInterval);
    
    // Clear smoke particles
    const smokeContainer = document.getElementById('smoke-container');
    if (smokeContainer) {
      smokeContainer.innerHTML = '';
    }
  });

})();
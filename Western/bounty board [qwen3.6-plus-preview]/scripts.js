/**
 * THE DUSTY BOUNTY BOARD — INTERACTIVE SCRIPTS
 * ============================================
 * Brings the frontier to life with animations, 
 * navigation, particle effects, and interactions.
 */

(function() {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Throttle function to limit execution rate
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  /**
   * Generate random number between min and max
   */
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate random integer
   */
  function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
  }

  // ============================================
  // DUST PARTICLE SYSTEM
  // ============================================

  class DustParticleSystem {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.maxParticles = 120;
      this.isRunning = false;
      this.animationId = null;

      this.init();
    }

    init() {
      this.resize();
      this.createParticles();
      this.start();

      window.addEventListener('resize', debounce(() => this.resize(), 250));
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle() {
      return {
        x: random(0, this.canvas.width),
        y: random(0, this.canvas.height),
        size: random(0.5, 3),
        speedX: random(-0.3, 0.3),
        speedY: random(-0.2, 0.2),
        opacity: random(0.1, 0.6),
        opacitySpeed: random(-0.005, 0.005),
        color: this.randomDustColor()
      };
    }

    randomDustColor() {
      const colors = [
        '196, 150, 58',  // gold
        '184, 154, 106', // light wood
        '212, 184, 150', // parchment
        '166, 124, 82',  // aged
        '139, 105, 20',  // dark gold
        '200, 170, 130'  // sand
      ];
      return colors[randomInt(0, colors.length - 1)];
    }

    update() {
      this.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        // Fade opacity in and out
        if (p.opacity <= 0.1 || p.opacity >= 0.6) {
          p.opacitySpeed *= -1;
        }

        // Wrap around edges
        if (p.x < -10) p.x = this.canvas.width + 10;
        if (p.x > this.canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.y > this.canvas.height + 10) p.y = -10;

        // Wind effect - gentle rightward drift
        p.speedX += random(-0.01, 0.02);
        p.speedX = Math.max(-0.5, Math.min(0.5, p.speedX));
      });
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        this.ctx.fill();
        
        // Subtle glow for larger particles
        if (p.size > 1.5) {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.2})`;
          this.ctx.fill();
        }
      });
    }

    animate() {
      if (!this.isRunning) return;
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
      this.isRunning = true;
      this.animate();
    }

    stop() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // ============================================
  // SALOON DOOR ANIMATION
  // ============================================

  class SaloonDoorController {
    constructor(doorId) {
      this.doors = document.getElementById(doorId);
      if (!this.doors) return;

      this.mainContent = document.getElementById('main-content');
      this.isOpen = false;
      this.hasOpened = false;

      this.init();
    }

    init() {
      // Auto-open after a brief delay
      setTimeout(() => {
        this.open();
      }, 1500);

      // Allow click to reopen/close
      this.doors.addEventListener('click', () => {
        if (this.isOpen) {
          this.close();
          setTimeout(() => this.open(), 2000);
        }
      });
    }

    open() {
      if (this.hasOpened) return;
      this.hasOpened = true;
      this.isOpen = true;
      
      this.doors.classList.add('opened');
      
      // Reveal main content
      setTimeout(() => {
        this.mainContent.classList.add('visible');
      }, 600);

      // Remove doors from flow after animation
      setTimeout(() => {
        this.doors.style.display = 'none';
      }, 1600);
    }

    close() {
      this.isOpen = false;
      this.doors.classList.remove('opened');
      this.doors.style.display = 'flex';
      this.mainContent.classList.remove('visible');
    }
  }

  // ============================================
  // REVOLVER CYLINDER NAVIGATION
  // ============================================

  class RevolverNavigation {
    constructor(navId) {
      this.nav = document.getElementById(navId);
      if (!this.nav) return;

      this.cylinder = this.nav.querySelector('#cylinder');
      this.chambers = this.cylinder.querySelectorAll('.chamber');
      this.sections = [];
      this.currentRotation = 0;
      this.currentSection = 0;
      this.isAnimating = false;

      this.init();
    }

    init() {
      // Collect section IDs
      this.chambers.forEach((chamber, index) => {
        const sectionId = chamber.dataset.section;
        this.sections.push(sectionId);

        chamber.addEventListener('click', () => {
          if (!this.isAnimating && index !== this.currentSection) {
            this.rotateTo(index);
          }
        });

        // Set initial active state
        if (index === 0) chamber.classList.add('active');
      });

      // Set initial chamber positions in a circle
      this.positionChambers();
    }

    positionChambers() {
      const chamberCount = this.chambers.length;
      const angleStep = 360 / chamberCount;

      this.chambers.forEach((chamber, index) => {
        const angle = angleStep * index - 90; // Start from top
        const radius = 100; // Distance from center
        const radian = (angle * Math.PI) / 180;
        
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        chamber.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    rotateTo(sectionIndex) {
      this.isAnimating = true;

      // Calculate rotation needed
      const angleStep = 360 / this.chambers.length;
      const targetRotation = -angleStep * sectionIndex;

      // Ensure we rotate the shortest path
      let rotationDiff = targetRotation - this.currentRotation;
      
      // Normalize to shortest rotation
      while (rotationDiff > 180) rotationDiff -= 360;
      while (rotationDiff < -180) rotationDiff += 360;

      this.currentRotation += rotationDiff;
      this.currentSection = sectionIndex;

      // Apply rotation
      this.cylinder.style.transform = `translate(-50%, -50%) rotate(${this.currentRotation}deg)`;

      // Update active chamber
      this.chambers.forEach((chamber, index) => {
        chamber.classList.toggle('active', index === sectionIndex);
      });

      // Scroll to section
      const targetSection = document.getElementById(this.sections[sectionIndex]);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Reset animation flag
      setTimeout(() => {
        this.isAnimating = false;
      }, 700);
    }

    // Highlight current section based on scroll position
    updateOnScroll() {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      this.sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          if (this.currentSection !== index) {
            this.currentSection = index;
            this.chambers.forEach((chamber, i) => {
              chamber.classList.toggle('active', i === index);
            });
          }
        }
      });
    }
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================

  class ScrollRevealController {
    constructor() {
      this.sections = document.querySelectorAll('.section');
      this.posters = document.querySelectorAll('.wanted-poster');
      this.tiers = document.querySelectorAll('.reward-tier');
      this.profiles = document.querySelectorAll('.outlaw-profile');
      this.entries = document.querySelectorAll('.dispatch-entry');

      this.init();
    }

    init() {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animations for children
            this.staggerChildren(entry.target);
            
            // Optionally unobserve after revealing
            // observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe sections
      this.sections.forEach(section => {
        observer.observe(section);
      });
    }

    staggerChildren(parent) {
      const children = parent.querySelectorAll('.wanted-poster, .reward-tier, .outlaw-profile, .dispatch-entry');
      
      children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        
        // Trigger reveal
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, 100);
      });
    }
  }

  // ============================================
  // POSTER INTERACTIONS
  // ============================================

  class PosterInteractions {
    constructor() {
      this.posters = document.querySelectorAll('.wanted-poster');
      this.init();
    }

    init() {
      this.posters.forEach(poster => {
        // Add random slight rotation on load
        const randomRotation = random(-3, 3);
        poster.style.setProperty('--rotation', `${randomRotation}deg`);

        // Parallax tilt effect on hover
        poster.addEventListener('mousemove', (e) => {
          const rect = poster.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          poster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        poster.addEventListener('mouseleave', () => {
          poster.style.transform = '';
        });

        // Danger stamp click animation
        const stamp = poster.querySelector('.poster-stamp');
        if (stamp) {
          stamp.addEventListener('click', (e) => {
            e.stopPropagation();
            stamp.style.transform = 'rotate(-15deg) scale(1.2)';
            stamp.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
              stamp.style.transform = 'rotate(-15deg) scale(1)';
            }, 200);
          });
        }
      });
    }
  }

  // ============================================
  // MAP INTERACTIONS
  // ============================================

  class MapInteractions {
    constructor() {
      this.pins = document.querySelectorAll('.map-pin');
      this.init();
    }

    init() {
      this.pins.forEach(pin => {
        // Pulse animation on hover
        pin.addEventListener('mouseenter', () => {
          const dot = pin.querySelector('.pin-dot');
          dot.style.boxShadow = '0 0 0 8px rgba(139, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.5)';
        });

        pin.addEventListener('mouseleave', () => {
          const dot = pin.querySelector('.pin-dot');
          dot.style.boxShadow = '';
        });

        // Click to show more info (could expand to modal)
        pin.addEventListener('click', () => {
          const outlawName = pin.dataset.outlaw;
          const location = pin.dataset.location;
          console.log(`Scouting report: ${outlawName} spotted near ${location}`);
          
          // Could add a tooltip or info panel here
          this.showLocationInfo(pin, outlawName, location);
        });
      });
    }

    showLocationInfo(pin, name, location) {
      // Remove existing info panel if any
      const existing = document.querySelector('.map-info-panel');
      if (existing) existing.remove();

      // Create info panel
      const panel = document.createElement('div');
      panel.className = 'map-info-panel';
      panel.innerHTML = `
        <strong>${name}</strong><br>
        <em>Last seen: ${location}</em>
      `;
      panel.style.cssText = `
        position: absolute;
        background: rgba(44, 24, 16, 0.95);
        color: #F5E6C8;
        padding: 12px 16px;
        border: 2px solid #8B6914;
        border-radius: 4px;
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        pointer-events: none;
      `;

      // Position near pin
      const pinRect = pin.getBoundingClientRect();
      const mapRect = pin.closest('.map-surface').getBoundingClientRect();
      
      panel.style.left = `${pin.offsetLeft}px`;
      panel.style.top = `${pin.offsetTop - 60}px`;
      panel.style.transform = 'translateX(-50%)';

      pin.closest('.map-surface').appendChild(panel);

      // Auto-remove after delay
      setTimeout(() => {
        panel.style.opacity = '0';
        panel.style.transition = 'opacity 0.5s ease';
        setTimeout(() => panel.remove(), 500);
      }, 3000);
    }
  }

  // ============================================
  // DISPATCH LOG INTERACTIONS
  // ============================================

  class DispatchLogController {
    constructor() {
      this.entries = document.querySelectorAll('.dispatch-entry');
      this.init();
    }

    init() {
      this.entries.forEach(entry => {
        // Expand/collapse on click
        entry.addEventListener('click', () => {
          entry.classList.toggle('expanded');
        });

        // Add hover sound effect simulation (visual feedback)
        entry.addEventListener('mouseenter', () => {
          const seal = entry.querySelector('.entry-seal');
          if (seal) {
            seal.style.transform = 'scale(1.1)';
            seal.style.transition = 'transform 0.2s ease';
          }
        });

        entry.addEventListener('mouseleave', () => {
          const seal = entry.querySelector('.entry-seal');
          if (seal) {
            seal.style.transform = '';
          }
        });
      });
    }
  }

  // ============================================
  // TIP FORM HANDLING
  // ============================================

  class TipFormController {
    constructor(formId) {
      this.form = document.getElementById(formId);
      if (!this.form) return;

      this.init();
    }

    init() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      // Add input focus effects
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
          input.parentElement.classList.remove('focused');
        });
      });
    }

    handleSubmit() {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Validate
      if (!data['tip-outlaw'] || !data['tip-message']) {
        this.showNotification('Please fill in the required fields.', 'error');
        return;
      }

      // Simulate submission
      const submitBtn = this.form.querySelector('.submit-btn');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      
      submitBtn.querySelector('.btn-text').textContent = 'SENDING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Success
        this.showNotification('Your telegram has been dispatched to the Marshal\'s office!', 'success');
        this.form.reset();
        
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }

    showNotification(message, type = 'success') {
      // Remove existing notification
      const existing = document.querySelector('.form-notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = 'form-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2d5016' : '#8b0000'};
        color: #f5e6c8;
        padding: 16px 24px;
        border: 2px solid #8b6914;
        border-radius: 4px;
        font-family: 'IM Fell English', serif;
        font-size: 1rem;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        max-width: 400px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      `;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Animate in
      requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
      });

      // Auto-remove
      setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
      }, 4000);
    }
  }

  // ============================================
  // TUMBLEWEED ENHANCEMENT
  // ============================================

  class TumbleweedController {
    constructor() {
      this.tumbleweeds = document.querySelectorAll('.tumbleweed');
      this.init();
    }

    init() {
      // Randomize starting positions slightly
      this.tumbleweeds.forEach(tw => {
        const randomTop = random(60, 90);
        tw.style.top = `${randomTop}%`;
      });
    }
  }

  // ============================================
  // HEADER SCROLL EFFECTS
  // ============================================

  class HeaderScrollEffects {
    constructor() {
      this.header = document.querySelector('.site-header');
      this.isScrolled = false;
      this.init();
    }

    init() {
      window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100 && !this.isScrolled) {
          this.header.classList.add('scrolled');
          this.isScrolled = true;
        } else if (scrollY <= 100 && this.isScrolled) {
          this.header.classList.remove('scrolled');
          this.isScrolled = false;
        }
      }, 100));
    }
  }

  // ============================================
  // RANDOM POSTER WEAR & TEAR EFFECTS
  // ============================================

  class PosterAgingEffects {
    constructor() {
      this.posters = document.querySelectorAll('.wanted-poster');
      this.init();
    }

    init() {
      // Add random coffee stains, tears, etc.
      this.posters.forEach(poster => {
        this.addRandomStains(poster);
        this.addRandomCreases(poster);
      });
    }

    addRandomStains(poster) {
      const stainCount = randomInt(1, 3);
      for (let i = 0; i < stainCount; i++) {
        const stain = document.createElement('div');
        stain.className = 'coffee-stain';
        stain.style.cssText = `
          position: absolute;
          width: ${random(20, 60)}px;
          height: ${random(20, 60)}px;
          background: radial-gradient(circle, rgba(139, 105, 20, 0.15), transparent);
          border-radius: 50%;
          top: ${random(10, 80)}%;
          left: ${random(10, 80)}%;
          pointer-events: none;
          z-index: 1;
        `;
        poster.appendChild(stain);
      }
    }

    addRandomCreases(poster) {
      const creaseCount = randomInt(1, 2);
      for (let i = 0; i < creaseCount; i++) {
        const crease = document.createElement('div');
        crease.className = 'paper-crease';
        const angle = random(-30, 30);
        crease.style.cssText = `
          position: absolute;
          width: ${random(100, 200)}px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 105, 20, 0.2), transparent);
          top: ${random(20, 70)}%;
          left: ${random(10, 60)}%;
          transform: rotate(${angle}deg);
          pointer-events: none;
          z-index: 1;
        `;
        poster.appendChild(crease);
      }
    }
  }

  // ============================================
  // FOOTER SCROLL TO TOP
  // ============================================

  class FooterInteractions {
    constructor() {
      this.footerLinks = document.querySelectorAll('.footer-link');
      this.init();
    }

    init() {
      this.footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  class KeyboardNavigation {
    constructor(revolverNav) {
      this.revolverNav = revolverNav;
      this.init();
    }

    init() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (this.revolverNav.currentSection + 1) % this.revolverNav.sections.length;
          this.revolverNav.rotateTo(nextIndex);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (this.revolverNav.currentSection - 1 + this.revolverNav.sections.length) % this.revolverNav.sections.length;
          this.revolverNav.rotateTo(prevIndex);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.revolverNav.rotateTo(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.revolverNav.rotateTo(this.revolverNav.sections.length - 1);
        }
      });
    }
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================

  class ParallaxController {
    constructor() {
      this.init();
    }

    init() {
      window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        // Parallax for header badge
        const badge = document.querySelector('.badge-star');
        if (badge) {
          badge.style.transform = `rotate(${scrollY * 0.05}deg)`;
        }

        // Parallax for tumbleweeds
        const tumbleweeds = document.querySelectorAll('.tumbleweed');
        tumbleweeds.forEach((tw, index) => {
          const speed = 0.1 + (index * 0.05);
          tw.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }, 50));
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
      initializeApp();
    }
  }

  function initializeApp() {
    // Initialize all controllers
    const dustSystem = new DustParticleSystem('dust-canvas');
    const saloonDoors = new SaloonDoorController('saloon-doors');
    const revolverNav = new RevolverNavigation('revolver-nav');
    const scrollReveal = new ScrollRevealController();
    const posterInteractions = new PosterInteractions();
    const mapInteractions = new MapInteractions();
    const dispatchLog = new DispatchLogController();
    const tipForm = new TipFormController('tip-form');
    const tumbleweeds = new TumbleweedController();
    const headerEffects = new HeaderScrollEffects();
    const posterAging = new PosterAgingEffects();
    const footerInteractions = new FooterInteractions();
    const keyboardNav = new KeyboardNavigation(revolverNav);
    const parallax = new ParallaxController();

    // Scroll listener for revolver nav updates
    window.addEventListener('scroll', throttle(() => {
      revolverNav.updateOnScroll();
    }, 100));

    // Add smooth scroll behavior for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Easter egg: Konami code triggers special effect
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.key);
      konamiCode = konamiCode.slice(-10);
      
      if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        triggerEasterEgg();
      }
    });
  }

  function triggerEasterEgg() {
    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(196, 150, 58, 0.3), transparent);
      z-index: 99999;
      pointer-events: none;
      animation: easterEggFlash 1s ease-out forwards;
    `;
    document.body.appendChild(flash);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes easterEggFlash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      flash.remove();
      style.remove();
    }, 1000);
    
    console.log('🤠 Howdy, partner! You found the secret!');
  }

  // Start the app
  init();

})();
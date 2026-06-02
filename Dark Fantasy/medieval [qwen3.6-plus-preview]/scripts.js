/* ═══════════════════════════════════════════════════════
   CODEX UMBRA — Interactive JavaScript
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─────────────────────────────────────────────────────
  // ELEMENTS
  // ─────────────────────────────────────────────────────
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const particlesContainer = document.getElementById('particles');
  const cursor = document.getElementById('cursor');
  const cursorGlow = document.getElementById('cursorGlow');
  const mainNav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const ambientToggle = document.getElementById('ambientToggle');
  const mapCanvas = document.getElementById('mapCanvas');
  const mapTooltip = document.getElementById('mapTooltip');
  const mapLocations = document.querySelectorAll('.map-location');

  // ─────────────────────────────────────────────────────
  // LOADING SCREEN
  // ─────────────────────────────────────────────────────
  function initLoadingScreen() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          document.body.style.overflow = '';
          initHeroAnimations();
        }, 400);
      }
      loadingBarFill.style.width = `${progress}%`;
    }, 150);
  }

  // ─────────────────────────────────────────────────────
  // CUSTOM CURSOR
  // ─────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverElements = document.querySelectorAll('a, button, .creature-card, .codex-entry, .map-location, .rune-grid span');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorGlow.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorGlow.classList.remove('hover');
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // AMBIENT PARTICLES
  // ─────────────────────────────────────────────────────
  let particlesActive = true;
  let particleInterval = null;

  function createParticle() {
    if (!particlesActive) return;

    const particle = document.createElement('div');
    particle.classList.add('particle');

    const startX = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const size = Math.random() * 3 + 1;
    const delay = Math.random() * 2;

    particle.style.left = `${startX}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    // Random ember colors
    const colors = [
      'var(--color-accent-gold)',
      'var(--color-accent-ember)',
      'var(--color-text-muted)',
      '#b06030'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;

    particlesContainer.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, (duration + delay) * 1000);
  }

  function initParticles() {
    // Create initial batch
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 200);
    }

    // Continue creating
    particleInterval = setInterval(createParticle, 800);
  }

  // ─────────────────────────────────────────────────────
  // SCROLL ANIMATIONS
  // ─────────────────────────────────────────────────────
  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve to allow re-triggering if needed
          // But for performance, we can unobserve
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-animate], [data-reveal="true"]');
    animatedElements.forEach(el => observer.observe(el));
  }

  // ─────────────────────────────────────────────────────
  // HERO ANIMATIONS
  // ─────────────────────────────────────────────────────
  function initHeroAnimations() {
    const titleElements = document.querySelectorAll('[data-animate="title"]');
    const fadeElements = document.querySelectorAll('[data-animate="fade"]');

    titleElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 200);
    });

    fadeElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 600 + (i * 150));
    });
  }

  // ─────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────
  function initNavigation() {
    // Scroll detection
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // MAP INTERACTIONS
  // ─────────────────────────────────────────────────────
  function initMap() {
    mapLocations.forEach(location => {
      location.addEventListener('mouseenter', (e) => {
        const name = location.dataset.name;
        const desc = location.dataset.desc;

        mapTooltip.querySelector('.tooltip-title').textContent = name;
        mapTooltip.querySelector('.tooltip-desc').textContent = desc;

        // Position tooltip
        const rect = location.getBoundingClientRect();
        const mapRect = mapCanvas.getBoundingClientRect();

        const x = rect.left + rect.width / 2 - mapRect.left;
        const y = rect.top - mapRect.top;

        mapTooltip.style.left = `${x}px`;
        mapTooltip.style.top = `${y}px`;
        mapTooltip.classList.add('visible');
      });

      location.addEventListener('mouseleave', () => {
        mapTooltip.classList.remove('visible');
      });
    });
  }

  // ─────────────────────────────────────────────────────
  // AMBIENT TOGGLE
  // ─────────────────────────────────────────────────────
  function initAmbientToggle() {
    ambientToggle.addEventListener('click', () => {
      ambientToggle.classList.toggle('active');
      particlesActive = !particlesActive;

      if (particlesActive) {
        particlesContainer.style.display = '';
        initParticles();
      } else {
        particlesContainer.innerHTML = '';
        if (particleInterval) clearInterval(particleInterval);
      }
    });
  }

  // ─────────────────────────────────────────────────────
  // TORCH FLICKER RANDOMIZATION
  // ─────────────────────────────────────────────────────
  function initTorchFlicker() {
    const flames = document.querySelectorAll('.torch-flame');
    flames.forEach(flame => {
      // Randomize animation duration slightly
      const baseDuration = 2;
      const randomDuration = baseDuration + (Math.random() * 0.5 - 0.25);
      flame.style.animationDuration = `${randomDuration}s`;
    });

    const glows = document.querySelectorAll('.torch-glow');
    glows.forEach(glow => {
      const baseDuration = 3;
      const randomDuration = baseDuration + (Math.random() * 0.6 - 0.3);
      glow.style.animationDuration = `${randomDuration}s`;
    });
  }

  // ─────────────────────────────────────────────────────
  // STAT BAR ANIMATION
  // ─────────────────────────────────────────────────────
  function initStatBars() {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.stat-fill');
          fills.forEach(fill => {
            const width = fill.style.getPropertyValue('--fill');
            fill.style.width = '0%';
            setTimeout(() => {
              fill.style.width = width;
            }, 200);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.creature-card').forEach(card => {
      statObserver.observe(card);
    });
  }

  // ─────────────────────────────────────────────────────
  // PARALLAX SUBTLE EFFECT
  // ─────────────────────────────────────────────────────
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;

      if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${rate}px)`;
        heroContent.style.transform = `translateY(${rate * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    });
  }

  // ─────────────────────────────────────────────────────
  // EASTER EGG: KONAMI CODE
  // ─────────────────────────────────────────────────────
  function initEasterEgg() {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Activate secret mode
          document.body.classList.add('secret-mode');
          konamiIndex = 0;

          // Flash effect
          const flash = document.createElement('div');
          flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: var(--color-accent-gold);
            opacity: 0.3;
            z-index: 99999;
            pointer-events: none;
            transition: opacity 0.5s ease;
          `;
          document.body.appendChild(flash);
          setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
          }, 100);
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  // ─────────────────────────────────────────────────────
  // INITIALIZE EVERYTHING
  // ─────────────────────────────────────────────────────
  function init() {
    document.body.style.overflow = 'hidden';
    
    initLoadingScreen();
    initCursor();
    initParticles();
    initScrollAnimations();
    initNavigation();
    initMap();
    initAmbientToggle();
    initTorchFlicker();
    initStatBars();
    initParallax();
    initEasterEgg();
  }

  init();

});
/* ============================================================
   СКАЗАНИЯ — Bestiary of Slavic Folklore
   JavaScript: Scroll reveals, ember particles, navigation,
   and ambient interactive effects
   ============================================================ */

(() => {
  'use strict';

  // ---- DOM References ----
  const DOM = {
    body: document.body,
    fireGlow: document.getElementById('fireGlow'),
    embersContainer: document.getElementById('embersContainer'),
    pages: document.querySelectorAll('.page'),
    navDots: document.querySelectorAll('.nav-dot'),
    enterBtn: document.getElementById('enterBtn'),
    contentsPage: document.getElementById('contentsPage'),
    contentsLinks: document.querySelectorAll('.contents-entry'),
  };

  // ---- Configuration ----
  const CONFIG = {
    emberCount: 18,
    emberInterval: 600,
    observerThreshold: 0.15,
    observerRootMargin: '0px 0px -10% 0px',
    scrollDebounce: 50,
  };

  // ---- Utility Functions ----

  /**
   * Debounce function for scroll events
   */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Clamp a value between min and max
   */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Linear interpolation
   */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // ---- Page Reveal System ----

  /**
   * Initialize Intersection Observer for scroll-triggered page reveals
   */
  function initPageReveals() {
    const observerOptions = {
      root: null,
      threshold: CONFIG.observerThreshold,
      rootMargin: CONFIG.observerRootMargin,
    };

    const pageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after reveal for performance
          // pageObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    DOM.pages.forEach((page) => {
      pageObserver.observe(page);
    });
  }

  // ---- Ember Particle System ----

  /**
   * Create a single ember particle element
   */
  function createEmber() {
    const ember = document.createElement('div');
    ember.classList.add('ember');

    // Randomize position, size, drift, and animation duration
    const startX = Math.random() * 100;
    const size = clamp(Math.random() * 3 + 1, 1, 4);
    const drift = (Math.random() - 0.5) * 80;
    const duration = clamp(Math.random() * 8 + 6, 6, 14);
    const delay = Math.random() * CONFIG.emberInterval * 10;

    ember.style.cssText = `
      left: ${startX}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}ms;
    `;

    return ember;
  }

  /**
   * Initialize ember particles
   */
  function initEmbers() {
    for (let i = 0; i < CONFIG.emberCount; i++) {
      DOM.embersContainer.appendChild(createEmber());
    }

    // Periodically respawn embers
    setInterval(() => {
      const embers = DOM.embersContainer.querySelectorAll('.ember');
      if (embers.length < CONFIG.emberCount) {
        DOM.embersContainer.appendChild(createEmber());
      }
      // Remove old embers to prevent DOM bloat
      if (embers.length > CONFIG.emberCount * 1.5) {
        embers[0].remove();
      }
    }, CONFIG.emberInterval * 5);
  }

  // ---- Navigation Dots System ----

  /**
   * Update active navigation dot based on scroll position
   */
  function updateActiveDot() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let activeIndex = 0;

    DOM.pages.forEach((page, index) => {
      const rect = page.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      if (scrollPos >= pageTop) {
        activeIndex = index;
      }
    });

    DOM.navDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  /**
   * Initialize navigation dot click handlers
   */
  function initNavDots() {
    DOM.navDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Throttled scroll listener for dot updates
    window.addEventListener(
      'scroll',
      debounce(updateActiveDot, CONFIG.scrollDebounce),
      { passive: true }
    );

    // Initial state
    updateActiveDot();
  }

  // ---- Enter Button ----

  /**
   * Initialize the "Open the Tome" button
   */
  function initEnterButton() {
    if (!DOM.enterBtn) return;

    DOM.enterBtn.addEventListener('click', () => {
      DOM.contentsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- Table of Contents Links ----

  /**
   * Smooth scroll for contents links with offset
   */
  function initContentsLinks() {
    DOM.contentsLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Ambient Fire Glow (Mouse Tracking) ----

  /**
   * Subtle mouse-tracking fire glow effect
   */
  function initFireGlowTracking() {
    let mouseX = 0.5;
    let mouseY = 0.5;
    let glowX = 0.5;
    let glowY = 0.5;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    }, { passive: true });

    function animateGlow() {
      // Smooth interpolation
      glowX = lerp(glowX, mouseX, 0.03);
      glowY = lerp(glowY, mouseY, 0.03);

      const fireGlowEl = DOM.fireGlow;
      if (fireGlowEl) {
        const offsetX = (glowX - 0.5) * 20;
        const offsetY = (glowY - 0.5) * 15;
        fireGlowEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ---- Parallax on Woodcut Illustrations ----

  /**
   * Subtle parallax effect on creature illustrations when scrolled into view
   */
  function initIllustrationParallax() {
    const illustrations = document.querySelectorAll('.woodcut-art');

    function updateParallax() {
      illustrations.forEach((illust) => {
        const rect = illust.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;

        if (visible) {
          const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
          const yOffset = (progress - 0.5) * 15;
          illust.style.transform = `translateY(${yOffset}px)`;
          illust.style.transition = 'transform 0.1s ease-out';
        }
      });
    }

    window.addEventListener('scroll', debounce(updateParallax, 30), { passive: true });
  }

  // ---- Scroll Progress Indicator (Optional Enhancement) ----

  /**
   * Add subtle visual feedback based on scroll depth
   */
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #c45a20, #e8a040);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s ease-out;
      box-shadow: 0 0 6px rgba(232, 160, 64, 0.4);
    `;
    DOM.body.appendChild(progressBar);

    window.addEventListener(
      'scroll',
      debounce(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
      }, CONFIG.scrollDebounce),
      { passive: true }
    );
  }

  // ---- Page Edge Glow on Scroll ----

  /**
   * Intensify page edge glow based on scroll velocity
   */
  function initEdgeGlow() {
    let lastScrollY = 0;
    let velocity = 0;
    const leftEdge = document.querySelector('.page-edge.left');
    const rightEdge = document.querySelector('.page-edge.right');

    function updateEdgeGlow() {
      const currentScrollY = window.scrollY;
      velocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      const intensity = clamp(velocity / 50, 0.15, 0.5);

      if (leftEdge) {
        leftEdge.style.opacity = intensity;
      }
      if (rightEdge) {
        rightEdge.style.opacity = intensity;
      }

      // Decay velocity
      velocity *= 0.95;

      requestAnimationFrame(updateEdgeGlow);
    }

    requestAnimationFrame(updateEdgeGlow);
  }

  // ---- Danger Rating Hover Effects ----

  /**
   * Add subtle pulse animation to danger symbols on hover
   */
  function initDangerHover() {
    const dangerContainers = document.querySelectorAll('.danger-rating');

    dangerContainers.forEach((container) => {
      container.addEventListener('mouseenter', () => {
        const symbols = container.querySelectorAll('.danger-symbol.active');
        symbols.forEach((sym, i) => {
          sym.style.animation = `dangerPulse 0.6s ease-in-out ${i * 0.1}s`;
        });
      });

      container.addEventListener('mouseleave', () => {
        const symbols = container.querySelectorAll('.danger-symbol.active');
        symbols.forEach((sym) => {
          sym.style.animation = '';
        });
      });
    });

    // Add keyframe for danger pulse
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes dangerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // ---- Initial Load Animation ----

  /**
   * Sequence the initial page load animations
   */
  function initLoadSequence() {
    // Add loading class to body
    DOM.body.classList.add('loading');

    // Remove loading class after a brief delay to trigger CSS transitions
    requestAnimationFrame(() => {
      setTimeout(() => {
        DOM.body.classList.remove('loading');
        // Force first page to be visible
        const firstPage = DOM.pages[0];
        if (firstPage) {
          firstPage.classList.add('visible');
        }
      }, 200);
    });
  }

  // ---- Initialization ----

  /**
   * Initialize all systems when DOM is ready
   */
  function init() {
    initLoadSequence();
    initPageReveals();
    initEmbers();
    initNavDots();
    initEnterButton();
    initContentsLinks();
    initFireGlowTracking();
    initIllustrationParallax();
    initScrollProgress();
    initEdgeGlow();
    initDangerHover();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
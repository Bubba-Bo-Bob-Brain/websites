/* ============================================================
   BESTIARIUM SLAVICUM — Scripts
   A Compendium of Creatures from the Dark Forest & Deep Waters
   ============================================================ */

(function () {
  'use strict';

  // ==================== STATE ====================
  const state = {
    isBookOpen: false,
    currentPageIndex: 0,
    pages: [],
    cursorX: 0,
    cursorY: 0,
    trailX: 0,
    trailY: 0,
    isScrolling: false,
    audioEnabled: false,
    audioContext: null,
  };

  // ==================== DOM REFERENCES ====================
  const elements = {
    // Overlays
    hearthGlow: document.getElementById('hearthGlow'),
    grainOverlay: document.getElementById('grainOverlay'),
    forestCanopy: document.getElementById('forestCanopy'),
    flickerOverlay: document.getElementById('flickerOverlay'),

    // Cursor
    customCursor: document.getElementById('customCursor'),
    cursorTrail: document.getElementById('cursorTrail'),

    // Scroll Progress
    scrollProgress: document.getElementById('scrollProgress'),

    // Cover
    cover: document.getElementById('cover'),
    openBookBtn: document.getElementById('openBookBtn'),

    // Book Content
    bookContent: document.getElementById('bookContent'),

    // Navigation
    bookNavigation: document.getElementById('bookNavigation'),
    navPrev: document.getElementById('navPrev'),
    navNext: document.getElementById('navNext'),
    pageIndicator: document.getElementById('pageIndicator'),

    // Audio
    audioToggle: document.getElementById('audioToggle'),

    // Page Flip
    pageFlipOverlay: document.getElementById('pageFlipOverlay'),

    // Table of Contents entries
    contentsEntries: document.querySelectorAll('.contents-entry'),
  };

  // ==================== INITIALIZATION ====================
  function init() {
    collectPages();
    setupEventListeners();
    setupIntersectionObserver();
    setupCustomCursor();
    setupScrollProgress();
    setupTableOfContents();
  }

  // ==================== PAGE COLLECTION ====================
  function collectPages() {
    // Collect all page-like sections in order
    const pageElements = document.querySelectorAll('.book-cover, .page');
    state.pages = Array.from(pageElements).map((el, index) => ({
      element: el,
      index: index,
      name: getPageName(el),
      id: el.id || `page-${index}`,
    }));
  }

  function getPageName(element) {
    if (element.classList.contains('book-cover')) return 'Cover';
    if (element.id === 'pageTitle') return 'Title Page';
    if (element.id === 'pageContents') return 'Index';
    if (element.id === 'pageDangerKey') return 'Peril Scale';
    if (element.id === 'pageColophon') return 'Colophon';

    // Creature pages
    const nameEl = element.querySelector('.creature-name');
    if (nameEl) {
      const numEl = element.querySelector('.creature-number');
      const num = numEl ? numEl.textContent.replace('.', '') : '';
      return `${num}. ${nameEl.textContent}`;
    }

    return 'Page';
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    // Open book
    elements.openBookBtn.addEventListener('click', openBook);

    // Navigation
    elements.navPrev.addEventListener('click', navigatePrev);
    elements.navNext.addEventListener('click', navigateNext);

    // Audio toggle
    elements.audioToggle.addEventListener('click', toggleAudio);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Scroll handler for nav visibility and progress
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mouse move for cursor
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Hover effects for interactive elements
    setupHoverEffects();
  }

  // ==================== OPEN BOOK ====================
  function openBook() {
    if (state.isBookOpen) return;
    state.isBookOpen = true;

    // Fade out cover
    elements.cover.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    elements.cover.style.opacity = '0';
    elements.cover.style.transform = 'scale(1.05)';

    setTimeout(() => {
      elements.cover.style.display = 'none';
      elements.bookContent.classList.add('is-visible');
      elements.bookNavigation.classList.add('is-visible');
      elements.audioToggle.classList.add('is-visible');

      // Scroll to top of book content
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger page reveals
      setTimeout(() => {
        triggerPageReveals();
      }, 300);
    }, 1000);
  }

  // ==================== NAVIGATION ====================
  function navigatePrev() {
    if (state.currentPageIndex <= 0) return;
    navigateToPage(state.currentPageIndex - 1);
  }

  function navigateNext() {
    if (state.currentPageIndex >= state.pages.length - 1) return;
    navigateToPage(state.currentPageIndex + 1);
  }

  function navigateToPage(index) {
    if (index < 0 || index >= state.pages.length) return;

    const targetPage = state.pages[index];
    state.isScrolling = true;

    // Page flip effect
    elements.pageFlipOverlay.classList.add('is-flipping');

    setTimeout(() => {
      targetPage.element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        elements.pageFlipOverlay.classList.remove('is-flipping');
        state.currentPageIndex = index;
        updateNavigation();
        state.isScrolling = false;
      }, 400);
    }, 300);
  }

  function updateNavigation() {
    const page = state.pages[state.currentPageIndex];

    // Update indicator
    elements.pageIndicator.querySelector('.current-page').textContent = page.name;

    // Update button states
    elements.navPrev.disabled = state.currentPageIndex <= 0;
    elements.navNext.disabled = state.currentPageIndex >= state.pages.length - 1;

    // Add visual feedback
    elements.navPrev.classList.add('btn-flash');
    elements.navNext.classList.add('btn-flash');
    setTimeout(() => {
      elements.navPrev.classList.remove('btn-flash');
      elements.navNext.classList.remove('btn-flash');
    }, 200);
  }

  // ==================== KEYBOARD HANDLING ====================
  function handleKeyboard(e) {
    if (!state.isBookOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBook();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        navigatePrev();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        navigateNext();
        break;
      case 'Home':
        e.preventDefault();
        navigateToPage(0);
        break;
      case 'End':
        e.preventDefault();
        navigateToPage(state.pages.length - 1);
        break;
    }
  }

  // ==================== SCROLL HANDLING ====================
  function handleScroll() {
    updateCurrentPageOnScroll();
  }

  function updateCurrentPageOnScroll() {
    if (!state.isBookOpen) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const centerPoint = scrollY + windowHeight / 2;

    let closestPage = state.pages[0];
    let closestDistance = Infinity;

    state.pages.forEach((page) => {
      const rect = page.element.getBoundingClientRect();
      const pageCenter = scrollY + rect.top + rect.height / 2;
      const distance = Math.abs(pageCenter - centerPoint);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = page;
      }
    });

    if (closestPage.index !== state.currentPageIndex) {
      state.currentPageIndex = closestPage.index;
      updateNavigation();
    }
  }

  // ==================== SCROLL PROGRESS ====================
  function setupScrollProgress() {
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
  }

  function updateScrollProgress() {
    if (!state.isBookOpen) {
      elements.scrollProgress.style.width = '0%';
      return;
    }

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    elements.scrollProgress.style.width = `${progress}%`;
  }

  // ==================== INTERSECTION OBSERVER ====================
  function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all pages
    document.querySelectorAll('.page').forEach((page) => {
      observer.observe(page);
    });
  }

  function triggerPageReveals() {
    document.querySelectorAll('.page').forEach((page, index) => {
      setTimeout(() => {
        page.classList.add('is-in-view');
      }, index * 100);
    });
  }

  // ==================== CUSTOM CURSOR ====================
  function setupCustomCursor() {
    // Check for touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      elements.customCursor.style.display = 'none';
      elements.cursorTrail.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    // Initial position
    state.cursorX = window.innerWidth / 2;
    state.cursorY = window.innerHeight / 2;
    state.trailX = state.cursorX;
    state.trailY = state.cursorY;

    updateCursor();
  }

  function handleMouseMove(e) {
    state.cursorX = e.clientX;
    state.cursorY = e.clientY;
  }

  function updateCursor() {
    // Smooth trail following
    const trailSpeed = 0.15;
    state.trailX += (state.cursorX - state.trailX) * trailSpeed;
    state.trailY += (state.cursorY - state.trailY) * trailSpeed;

    elements.customCursor.style.transform = `translate(${state.cursorX}px, ${state.cursorY}px) translate(-50%, -50%)`;
    elements.cursorTrail.style.transform = `translate(${state.trailX}px, ${state.trailY}px) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  }

  // ==================== HOVER EFFECTS ====================
  function setupHoverEffects() {
    const interactiveSelectors = [
      'a',
      'button',
      '.contents-entry',
      '.danger-level',
      '.lore-box',
      '.attribute',
      '.nav-btn',
      '.audio-toggle',
    ].join(', ');

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        elements.customCursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        elements.customCursor.classList.remove('is-hovering');
      }
    });
  }

  // ==================== TABLE OF CONTENTS ====================
  function setupTableOfContents() {
    elements.contentsEntries.forEach((entry) => {
      entry.addEventListener('click', () => {
        const targetId = entry.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          if (!state.isBookOpen) {
            openBook();
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1200);
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  // ==================== AUDIO ====================
  function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;

    if (state.audioEnabled) {
      initAudio();
      elements.audioToggle.style.color = 'var(--fire-core)';
      elements.audioToggle.style.borderColor = 'var(--fire-core)';
    } else {
      stopAudio();
      elements.audioToggle.style.color = '';
      elements.audioToggle.style.borderColor = '';
    }
  }

  function initAudio() {
    if (state.audioContext) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audioContext = new AudioContext();

      // Create a subtle ambient drone
      const oscillator = state.audioContext.createOscillator();
      const gainNode = state.audioContext.createGain();
      const filter = state.audioContext.createBiquadFilter();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, state.audioContext.currentTime); // Low drone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, state.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.02, state.audioContext.currentTime);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(state.audioContext.destination);

      oscillator.start();
      state.oscillator = oscillator;
      state.gainNode = gainNode;

      // Add a second, slightly detuned oscillator for warmth
      const osc2 = state.audioContext.createOscillator();
      const gain2 = state.audioContext.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(63, state.audioContext.currentTime);
      gain2.gain.setValueAtTime(0.015, state.audioContext.currentTime);

      osc2.connect(gain2);
      gain2.connect(state.audioContext.destination);
      osc2.start();

      state.oscillator2 = osc2;
      state.gainNode2 = gain2;
    } catch (e) {
      console.warn('Audio initialization failed:', e);
    }
  }

  function stopAudio() {
    if (state.oscillator) {
      state.oscillator.stop();
      state.oscillator = null;
    }
    if (state.oscillator2) {
      state.oscillator2.stop();
      state.oscillator2 = null;
    }
    if (state.audioContext) {
      state.audioContext.close();
      state.audioContext = null;
    }
  }

  // ==================== DYNAMIC HEARTH GLOW ====================
  function updateHearthGlow() {
    if (!state.isBookOpen) return;

    const time = Date.now() / 1000;
    const flicker1 = Math.sin(time * 2.3) * 0.03;
    const flicker2 = Math.sin(time * 3.7 + 1) * 0.02;
    const flicker3 = Math.sin(time * 5.1 + 2) * 0.015;
    const combined = flicker1 + flicker2 + flicker3;

    const baseOpacity = 0.06;
    const opacity = Math.max(0.02, baseOpacity + combined);

    elements.flickerOverlay.style.opacity = opacity;
  }

  // Start the flicker animation loop
  setInterval(updateHearthGlow, 50);

  // ==================== RANDOM PAGE TEXTURE VARIATION ====================
  function applyPageVariations() {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
      // Subtle random rotation for organic feel
      const rotation = (Math.random() - 0.5) * 0.3;
      page.style.transform = `rotate(${rotation}deg)`;

      // Staggered reveal delay
      page.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  // ==================== INITIALIZE ON DOM READY ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      applyPageVariations();
    });
  } else {
    init();
    applyPageVariations();
  }
})();
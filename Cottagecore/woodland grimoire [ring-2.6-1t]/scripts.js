/* ============================================================
   THE THORNWOOD GRIMOIRE — Interactive Scripts
   A Cottage Witch's Herbal Compendium
   ============================================================ */

(function () {
  'use strict';

  // ==================== DOM READY ====================
  document.addEventListener('DOMContentLoaded', function () {
    initLoadingScreen();
    initCursorGlow();
    initParticles();
    initNightMode();
    initNavigation();
    initMobileMenu();
    initScrollReveal();
    initPotionFilters();
    initHerbariumFilters();
    initForagingWheel();
    initGrimoire();
    initBackToTop();
    initSeasonalDisplay();
  });

  // ==================== LOADING SCREEN ====================
  function initLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    const messages = [
      'Stirring the cauldron...',
      'Grinding moonpetals...',
      'Consulting the stars...',
      'Binding the pages...',
      'Whispering incantations...',
      'Nearly ready...'
    ];

    let progress = 0;
    const totalDuration = 3500;
    const interval = 50;
    const step = (100 / (totalDuration / interval));
    let messageIndex = 0;

    const timer = setInterval(function () {
      progress += step + (Math.random() * 0.5);
      if (progress > 100) progress = 100;
      bar.style.width = progress + '%';

      // Update text at thresholds
      const thresholds = [15, 30, 50, 70, 85];
      if (messageIndex < thresholds.length && progress >= thresholds[messageIndex]) {
        text.textContent = messages[messageIndex + 1] || messages[messages.length - 1];
        messageIndex++;
      }

      if (progress >= 100) {
        clearInterval(timer);
        text.textContent = 'The grimoire is open...';
        setTimeout(function () {
          overlay.classList.add('hidden');
          // Enable scroll after loading
          document.body.style.overflow = '';
        }, 800);
      }
    }, interval);

    // Lock scroll during loading
    document.body.style.overflow = 'hidden';
  }

  // ==================== CURSOR GLOW ====================
  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.left = (glowX - 125) + 'px';
      glow.style.top = (glowY - 125) + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();

    // Hide glow on touch devices
    if ('ontouchstart' in window) {
      glow.style.display = 'none';
    }
  }

  // ==================== FLOATING PARTICLES ====================
  function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = (Math.random() * 8) + 's';
      particle.style.animationDuration = (6 + Math.random() * 8) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.2 + Math.random() * 0.4;

      // Randomly choose between gold and green particles
      if (Math.random() > 0.7) {
        particle.style.background = 'rgba(74, 124, 89, 0.6)';
      }

      container.appendChild(particle);
    }
  }

  // ==================== NIGHT MODE ====================
  function initNightMode() {
    const toggle = document.getElementById('night-toggle');
    const body = document.body;

    // Check saved preference
    const saved = localStorage.getItem('thornwood-night-mode');
    if (saved === 'true') {
      body.classList.add('night-mode');
    }

    toggle.addEventListener('click', function () {
      body.classList.toggle('night-mode');
      const isNight = body.classList.contains('night-mode');
      localStorage.setItem('thornwood-night-mode', isNight);

      // Animate the toggle
      const scene = toggle.querySelector('.toggle-scene');
      scene.style.transform = isNight ? 'rotate(360deg)' : 'rotate(0deg)';
      scene.style.transition = 'transform 0.6s ease';
    });
  }

  // ==================== NAVIGATION ====================
  function initNavigation() {
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Show nav on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.classList.add('scrolled');
        nav.classList.remove('scrolled-out');
      } else {
        nav.classList.remove('scrolled');
        if (currentScroll < lastScroll || currentScroll < 50) {
          // Only hide if scrolling up and near top
        }
      }

      // Active link based on scroll position
      let current = '';
      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 120;
        if (currentScroll >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
          link.classList.add('active');
        }
      });

      lastScroll = currentScroll;
    });

    // Smooth scroll for nav links
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuBtn.addEventListener('click', function () {
      menuBtn.classList.add('active');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  // ==================== SCROLL REVEAL ====================
  function initScrollReveal() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if they have reveal-children class
          const children = entry.target.querySelectorAll('.reveal-child');
          children.forEach(function (child, i) {
            setTimeout(function () {
              child.classList.add('visible');
            }, i * 100);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-section').forEach(function (section) {
      observer.observe(section);
    });
  }

  // ==================== POTION FILTERS ====================
  function initPotionFilters() {
    const filterBtns = document.querySelectorAll('.filter-tabs .filter-btn[data-filter]');
    const potionCards = document.querySelectorAll('.potion-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active button
        filterBtns.forEach(function (b) { return b.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        potionCards.forEach(function (card) {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'cardReveal 0.4s ease forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ==================== HERBARIUM FILTERS ====================
  function initHerbariumFilters() {
    const filterBtns = document.querySelectorAll('[data-herb-filter]');
    const herbariumCards = document.querySelectorAll('.herbarium-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { return b.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.getAttribute('data-herb-filter');

        herbariumCards.forEach(function (card) {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'cardReveal 0.4s ease forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ==================== FORAGING WHEEL ====================
  function initForagingWheel() {
    const wheel = document.getElementById('foraging-wheel');
    const spinBtn = document.getElementById('wheel-spin-btn');
    const seasonPanel = document.getElementById('season-panel');
    const panelTitle = document.getElementById('season-panel-title');
    const ingredientsContainer = document.getElementById('season-ingredients');
    const segments = document.querySelectorAll('.wheel-segment');

    const seasonData = {
      spring: {
        name: 'Spring Foraging',
        ingredients: [
          { emoji: '🌿', name: 'Nettle', detail: 'Young leaves' },
          { emoji: '🌸', name: 'Elderflower', detail: 'Blooming clusters' },
          { emoji: '💜', name: 'Wild Garlic', detail: 'Woodland floors' },
          { emoji: '🟡', name: 'Dandelion', detail: 'Roots & greens' },
          { emoji: '🌱', name: 'Cleavers', detail: 'Fresh shoots' },
          { emoji: '🌺', name: 'Chickweed', detail: 'Shady patches' },
          { emoji: '🌼', name: 'Primrose', detail: 'Hedgerows' },
          { emoji: '🌹', name: 'Rose Hips', detail: 'Early buds' }
        ]
      },
      summer: {
        name: 'Summer Foraging',
        ingredients: [
          { emoji: '🫐', name: 'Wild Berries', detail: 'Brambles & bilberries' },
          { emoji: '🌻', name: 'Lavender', detail: 'Sunny meadows' },
          { emoji: '🌺', name: 'Hibiscus', detail: 'Garden borders' },
          { emoji: '🍯', name: 'Meadowsweet', detail: 'Riverbanks' },
          { emoji: '🌿', name: 'Lemon Balm', detail: 'Partial shade' },
          { emoji: '💐', name: 'Chamomile', detail: 'Sunlit fields' },
          { emoji: '🟣', name: 'Lingonberry', detail: 'Moorlands' },
          { emoji: '🌼', name: 'Calendula', detail: 'Garden edges' }
        ]
      },
      autumn: {
        name: 'Autumn Foraging',
        ingredients: [
          { emoji: '🍄', name: 'Chanterelle', detail: 'Mossy woodlands' },
          { emoji: '🌰', name: 'Chestnuts', detail: 'Woodland floors' },
          { emoji: '🍎', name: 'Crab Apples', detail: 'Hedgerows' },
          { emoji: '🫐', name: 'Elderberries', detail: 'Clusters on stems' },
          { emoji: '🌰', name: 'Acorns', detail: 'Beneath oaks' },
          { emoji: '🍂', name: 'Rose Hips', detail: 'After first frost' },
          { emoji: '🔴', name: 'Hawthorn Berries', detail: 'Thickets' },
          { emoji: '🟤', name: 'Sloe Berries', detail: 'Blackthorn hedges' }
        ]
      },
      winter: {
        name: 'Winter Foraging',
        ingredients: [
          { emoji: '🌲', name: 'Pine Needles', detail: 'Evergreen boughs' },
          { emoji: '🍄', name: 'Velvet Shank', detail: 'Dead wood' },
          { emoji: '❄️', name: 'Wintergreen', detail: 'Forest floor' },
          { emoji: '🫒', name: 'Juniper Berries', detail: 'Hillside scrub' },
          { emoji: '🌿', name: 'Rosemary', detail: 'Sheltered gardens' },
          { emoji: '🍃', name: 'Watercress', detail: 'Spring-fed streams' },
          { emoji: '🔥', name: 'Dried Sage', detail: 'Stored bundles' },
          { emoji: '🪵', name: 'Birch Bark', detail: 'Fallen branches' }
        ]
      }
    };

    let currentSeason = 'autumn';
    let isSpinning = false;

    // Season colors for the wheel segments
    const seasonColors = {
      spring: '#4a7c59',
      summer: '#c4953a',
      autumn: '#c47a2a',
      winter: '#5a8aad'
    };

    function renderIngredients(season) {
      const data = seasonData[season];
      panelTitle.textContent = data.name;
      ingredientsContainer.innerHTML = '';

      data.ingredients.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'season-ingredient';
        div.innerHTML =
          '<span class="ingredient-emoji">' + item.emoji + '</span>' +
          '<div>' +
          '<div class="ingredient-name">' + item.name + '</div>' +
          '<div class="ingredient-detail">' + item.detail + '</div>' +
          '</div>';
        ingredientsContainer.appendChild(div);
      });
    }

    // Initial render
    renderIngredients(currentSeason);

    // Highlight active segment
    function highlightSegment(season) {
      segments.forEach(function (seg) {
        seg.style.filter = '';
        seg.style.opacity = '1';
        if (seg.getAttribute('data-season') !== season) {
          seg.style.opacity = '0.5';
        }
      });
    }

    // Click on segments
    segments.forEach(function (segment) {
      segment.addEventListener('click', function () {
        if (isSpinning) return;
        const season = this.getAttribute('data-season');
        currentSeason = season;
        highlightSegment(season);
        renderIngredients(season);
      });
    });

    // Spin button
    spinBtn.addEventListener('click', function () {
      if (isSpinning) return;
      isSpinning = true;

      const seasons = ['spring', 'summer', 'autumn', 'winter'];
      const rotations = { spring: 0, summer: 90, autumn: 180, winter: 270 };

      // Random target
      const targetSeason = seasons[Math.floor(Math.random() * seasons.length)];
      const targetRotation = rotations[targetSeason];
      const fullSpins = 3 + Math.floor(Math.random() * 3);
      const totalRotation = fullSpins * 360 + targetRotation;

      // Add spin animation to wheel
      const style = document.createElement('style');
      const uniqueId = 'spin-' + Date.now();
      style.textContent =
        '@keyframes wheelSpin' + uniqueId + '{ ' +
        '0% { transform: rotate(0deg); } ' +
        '100% { transform: rotate(' + totalRotation + 'deg); } ' +
        '}';
      document.head.appendChild(style);

      wheel.style.animation = 'wheelSpin' + uniqueId + ' 3s cubic-bezier(0.15, 0.7, 0.3, 1) forwards';

      // Add shake to center button
      spinBtn.style.animation = 'none';
      spinBtn.offsetHeight; // reflow
      spinBtn.style.animation = 'btnPulse 0.3s ease';

      setTimeout(function () {
        currentSeason = targetSeason;
        highlightSegment(targetSeason);
        renderIngredients(targetSeason);

        // Particle burst effect
        createBurstEffect(spinBtn);

        isSpinning = false;

        // Clean up animation
        setTimeout(function () {
          wheel.style.animation = '';
          style.remove();
        }, 100);
      }, 3200);
    });

    function createBurstEffect(element) {
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText =
          'position:fixed;width:4px;height:4px;background:var(--accent-gold);border-radius:50%;pointer-events:none;z-index:9999;left:' + cx + 'px;top:' + cy + 'px;opacity:1;';
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 60 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(0)', opacity: 0 }
        ], { duration: 600 + Math.random() * 300 }).onfinish = function () {
          particle.remove();
        };
      }
    }

    // Add pulse animation for button
    const pulseKeyframes = '@keyframes btnPulse { 0% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.15); } 100% { transform: translate(-50%,-50%) scale(1); } }';
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = pulseKeyframes;
    document.head.appendChild(pulseStyle);
  }

  // ==================== GRIMOIRE BOOK ====================
  function initGrimoire() {
    const pages = document.querySelectorAll('.book-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    let currentPage = 0;
    let turning = false;

    function updateButtons() {
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === pages.length - 1;
    }

    function showPage(index) {
      if (index < 0 || index >= pages.length || turning) return;
      turning = true;

      pages.forEach(function (page) {
        page.classList.remove('active-page');
      });

      setTimeout(function () {
        pages[index].classList.add('active-page');
        currentPage = index;
        updateButtons();
        turning = false;
      }, 250);
    }

    prevBtn.addEventListener('click', function () {
      showPage(currentPage - 1);
    });

    nextBtn.addEventListener('click', function () {
      showPage(currentPage + 1);
    });

    // Keyboard navigation for grimoire
    document.addEventListener('keydown', function (e) {
      const grimoire = document.getElementById('grimoire');
      const rect = grimoire.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowLeft') {
          showPage(currentPage - 1);
        } else if (e.key === 'ArrowRight') {
          showPage(currentPage + 1);
        }
      }
    });

    updateButtons();
  }

  // ==================== BACK TO TOP ====================
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== SEASONAL DISPLAY ====================
  function initSeasonDisplay() {
    const month = new Date().getMonth() + 1;
    const seasonEl = document.getElementById('current-season');

    let season;
    if (month >= 3 && month <= 5) season = 'Spring';
    else if (month >= 6 && month <= 8) season = 'Summer';
    else if (month >= 9 && month <= 11) season = 'Autumn';
    else season = 'Winter';

    seasonEl.textContent = season;
  }

  // Moon phase calculation
  function getMoonPhase() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Simplified moon phase calculation
    const c = function (y, m) {
      y = y - Math.floor((12 - m) / 10);
      return 365.25 * y + 30.6 * (m + 1) + day - 694039.09;
    };

    const phase = c(year, month) / 29.53058867;
    const bip = phase - Math.floor(phase);
    const ag = bip * 29.53;

    if (ag < 1.84566) return 'New Moon';
    if (ag < 5.53699) return 'Waxing Crescent';
    if (ag < 9.22831) return 'First Quarter';
    if (ag < 12.91963) return 'Waxing Gibbous';
    if (ag < 16.61096) return 'Full Moon';
    if (ag < 20.30228) return 'Waning Gibbous';
    if (ag < 23.99361) return 'Last Quarter';
    if (ag < 27.68493) return 'Waning Crescent';
    return 'New Moon';
  }

  function initSeasonalDisplay() {
    initSeasonDisplay();
    const moonLabel = document.querySelector('.moon-label');
    if (moonLabel) {
      moonLabel.textContent = getMoonPhase();
    }
  }

  // ==================== INTERSECTION OBSERVER POLYFILL ====================
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all sections immediately
    document.querySelectorAll('.reveal-section').forEach(function (section) {
      section.classList.add('visible');
    });
  }

  // ==================== COOKIE CONSENT (Whimsical) ====================
  // Subtle: no cookie banner, just a local storage note
  if (!localStorage.getItem('thornwood_visitor')) {
    localStorage.setItem('thornwood_visitor', 'true');
  }

  // ==================== WINDOW RESIZE ====================
  window.addEventListener('resize', function () {
    // Debounced recalculations if needed
  });

})();
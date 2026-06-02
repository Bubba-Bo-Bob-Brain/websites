/* ═══════════════════════════════════════════════════════
   AniTrack — Spring 2025 Seasonal Calendar
   Interactive behaviors, animations, and logic
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────
     DOM REFERENCES
     ───────────────────────────────────────────────────── */
  const DOM = {
    cards: document.querySelectorAll('.anime-card'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sort-select'),
    viewToggles: document.querySelectorAll('.view-toggle'),
    seasonBtns: document.querySelectorAll('.season-btn'),
    statValues: document.querySelectorAll('.stat-value[data-count]'),
    grid: document.querySelector('.anime-grid'),
    mascot: document.getElementById('mascot'),
    mascotText: document.getElementById('mascot-text'),
    mascotSpeech: document.querySelector('.mascot-speech'),
    dayColumns: document.querySelectorAll('.day-column'),
    episodeBtns: document.querySelectorAll('.btn-episode'),
    rateBtns: document.querySelectorAll('.btn-rate'),
  };

  /* ─────────────────────────────────────────────────────
     UTILITY FUNCTIONS
     ───────────────────────────────────────────────────── */
  
  // Debounce helper
  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Easing functions
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Animate a number from 0 to target
  function animateNumber(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(start + (target - start) * easedProgress);
      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────────────
     1. HERO STAT COUNTER ANIMATION
     ───────────────────────────────────────────────────── */
  function initStatCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          DOM.statValues.forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            animateNumber(el, target, 2000);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      observer.observe(heroStats);
    }
  }

  /* ─────────────────────────────────────────────────────
     2. CARD SCROLL REVEAL (INTERSECTION OBSERVER)
     ───────────────────────────────────────────────────── */
  function initCardReveal() {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    DOM.cards.forEach(card => {
      cardObserver.observe(card);
    });
  }

  /* ─────────────────────────────────────────────────────
     3. FILTER FUNCTIONALITY
     ───────────────────────────────────────────────────── */
  function initFilters() {
    DOM.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        DOM.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter;

        // Filter cards with smooth transition
        DOM.cards.forEach((card, index) => {
          const cardStatus = card.dataset.status;
          const shouldShow = filterValue === 'all' || cardStatus === filterValue;

          if (shouldShow) {
            card.classList.remove('hidden');
            // Re-trigger reveal animation
            card.classList.remove('visible');
            card.style.transitionDelay = `${index * 0.05}s`;
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          } else {
            card.classList.add('hidden');
          }
        });

        // Mascot reaction
        updateMascot('filter', filterValue);
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     4. SORT FUNCTIONALITY
     ───────────────────────────────────────────────────── */
  function initSort() {
    DOM.sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      sortCards(sortBy);
      updateMascot('sort', sortBy);
    });
  }

  function sortCards(criteria) {
    const cardsArray = Array.from(DOM.cards);
    
    cardsArray.sort((a, b) => {
      switch (criteria) {
        case 'rating':
          return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        case 'title':
          return a.querySelector('.card-title').textContent.localeCompare(
            b.querySelector('.card-title').textContent
          );
        case 'studio':
          return a.dataset.studio.localeCompare(b.dataset.studio);
        case 'air-date':
        default:
          // Default order by HTML sequence (air date)
          return 0;
      }
    });

    // Re-append in sorted order with animation reset
    if (DOM.grid) {
      DOM.grid.innerHTML = '';
      cardsArray.forEach((card, index) => {
        card.classList.remove('visible');
        card.style.transitionDelay = `${index * 0.05}s`;
        DOM.grid.appendChild(card);
        // Trigger reflow
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      });
    }
  }

  /* ─────────────────────────────────────────────────────
     5. VIEW TOGGLE (GRID / LIST)
     ───────────────────────────────────────────────────── */
  function initViewToggle() {
    DOM.viewToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        DOM.viewToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');

        const view = toggle.dataset.view;
        if (DOM.grid) {
          if (view === 'list') {
            DOM.grid.classList.add('list-view');
          } else {
            DOM.grid.classList.remove('list-view');
          }
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     6. SEASON SELECTOR
     ───────────────────────────────────────────────────── */
  function initSeasonSelector() {
    DOM.seasonBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.seasonBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Visual feedback - in a real app, this would fetch new data
        updateMascot('season', btn.dataset.season);
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     7. LIVE COUNTDOWN TIMERS
     ───────────────────────────────────────────────────── */
  function initCountdowns() {
    const countdownRings = document.querySelectorAll('.card-countdown-ring');

    function updateCountdowns() {
      countdownRings.forEach(ring => {
        if (ring.classList.contains('countdown-complete')) return;

        const days = parseInt(ring.dataset.days, 10);
        const hours = parseInt(ring.dataset.hours, 10);
        const mins = parseInt(ring.dataset.minutes, 10);

        // Decrease time (simulated - decrement by 1 second per call)
        let totalMinutes = days * 24 * 60 + hours * 60 + mins;
        if (totalMinutes > 0) {
          totalMinutes -= 1; // 1 minute per update (accelerated for demo)
          
          const newDays = Math.floor(totalMinutes / (24 * 60));
          const newHours = Math.floor((totalMinutes % (24 * 60)) / 60);
          const newMins = totalMinutes % 60;

          ring.dataset.days = newDays;
          ring.dataset.hours = newHours;
          ring.dataset.minutes = newMins;

          // Update display
          const valueEl = ring.querySelector('.countdown-value');
          if (valueEl) {
            if (newDays > 0) {
              valueEl.textContent = `${newDays}d ${newHours}h`;
            } else {
              valueEl.textContent = `${newHours}h ${newMins}m`;
            }
          }

          // Update ring progress
          const totalDuration = parseInt(ring.dataset.days, 10) * 24 * 60 + 
                                parseInt(ring.dataset.hours, 10) * 60 + 
                                parseInt(ring.dataset.minutes, 10);
          const originalTotal = 7 * 24 * 60; // 1 week max
          const progress = Math.max(0, 1 - (totalMinutes / originalTotal));
          const circumference = 220; // 2 * PI * 35
          const offset = circumference * (1 - progress);
          
          const progressCircle = ring.querySelector('.countdown-progress');
          if (progressCircle) {
            progressCircle.style.strokeDashoffset = offset;
          }
        }
      });
    }

    // Update every second (accelerated countdown for visual effect)
    setInterval(updateCountdowns, 1000);
  }

  /* ─────────────────────────────────────────────────────
     8. CHIBI MASCOT SYSTEM
     ───────────────────────────────────────────────────── */
  const mascotMessages = {
    default: [
      "Ganbatte! Keep tracking! ✨",
      "Ready for today's episodes? 📺",
      "Your watchlist is looking great! 💫",
      "Don't forget to rate your shows! ⭐",
    ],
    filter: {
      watching: "Currently watching? Nice taste! 🎬",
      completed: "Completed list growing! Congrats! 🎉",
      "on-hold": "On hold... we'll get back to them! ⏸",
      "plan-to-watch": "So much to look forward to! 🔮",
      dropped: "Sometimes we drop shows, it's okay! 💔",
      all: "Viewing everything! Good explorer! 🌟"
    },
    sort: {
      "air-date": "Sorted by air date! Never miss an ep! 📅",
      rating: "Sorted by rating! Quality first! 👑",
      title: "Alphabetical order! So organized! 📚",
      studio: "Sorted by studio! Production matters! 🎨"
    },
    episode: [
      "Episode marked! Progress! 📈",
      "One step closer! Keep going! 🚀",
      "Nice! Updated your progress! ✅",
    ],
    season: {
      "winter-2025": "Winter '25 - Cozy watching season! ❄️",
      "spring-2025": "Spring '25 - Full bloom anime! 🌸",
      "summer-2025": "Summer '25 - Hot picks incoming! ☀️",
      "fall-2025": "Fall '25 - Autumn anime vibes! 🍂"
    }
  };

  function updateMascot(type, value = '') {
    let messages;
    if (type === 'filter' && mascotMessages.filter[value]) {
      messages = [mascotMessages.filter[value]];
    } else if (type === 'sort' && mascotMessages.sort[value]) {
      messages = [mascotMessages.sort[value]];
    } else if (type === 'episode') {
      messages = mascotMessages.episode;
    } else if (type === 'season' && mascotMessages.season[value]) {
      messages = [mascotMessages.season[value]];
    } else {
      messages = mascotMessages.default;
    }

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    DOM.mascotText.textContent = randomMsg;

    // Show speech bubble
    DOM.mascot.classList.add('active');
    
    // Auto-hide after 3 seconds
    clearTimeout(DOM._mascotTimer);
    DOM._mascotTimer = setTimeout(() => {
      DOM.mascot.classList.remove('active');
    }, 3000);
  }

  function initMascot() {
    // Click to cycle through messages
    DOM.mascot.addEventListener('click', () => {
      updateMascot('default');
    });

    // Initial greeting after 2 seconds
    setTimeout(() => {
      updateMascot('default');
    }, 2000);
  }

  /* ─────────────────────────────────────────────────────
     9. EPISODE TRACKING
     ───────────────────────────────────────────────────── */
  function initEpisodeTracking() {
    DOM.episodeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.anime-card');
        if (!card) return;

        const totalEps = parseInt(card.dataset.episodes, 10);
        let currentEp = parseInt(card.dataset.currentEp, 10);

        if (currentEp < totalEps) {
          currentEp++;
          card.dataset.currentEp = currentEp;

          // Update progress bar
          const progressPercent = (currentEp / totalEps) * 100;
          const progressFill = card.querySelector('.progress-fill');
          const progressText = card.querySelector('.progress-text');

          if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
          }
          if (progressText) {
            progressText.textContent = `Ep ${currentEp} / ${totalEps}`;
          }

          // Update button text
          if (currentEp >= totalEps) {
            btn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
              Rewatch
            `;
            btn.dataset.episode = 'rewatch';
            
            // Update status badge
            const statusBadge = card.querySelector('.card-status-badge');
            if (statusBadge) {
              statusBadge.className = 'card-status-badge status-completed';
              statusBadge.innerHTML = '<span class="status-dot"></span> Completed';
              card.dataset.status = 'completed';
            }

            // Update countdown to complete
            const countdownRing = card.querySelector('.card-countdown-ring');
            if (countdownRing) {
              countdownRing.classList.add('countdown-complete');
              const valueEl = countdownRing.querySelector('.countdown-value');
              const labelEl = countdownRing.querySelector('.countdown-label');
              if (valueEl) valueEl.textContent = '✓';
              if (labelEl) labelEl.textContent = 'DONE';
            }
          }

          // Mascot reaction
          updateMascot('episode');

          // Visual feedback - brief flash
          card.style.transition = 'box-shadow 0.3s ease';
          card.style.boxShadow = '0 0 40px rgba(0, 245, 212, 0.4)';
          setTimeout(() => {
            card.style.boxShadow = '';
          }, 500);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     10. HIGHLIGHT CURRENT DAY
     ───────────────────────────────────────────────────── */
  function highlightCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];

    DOM.dayColumns.forEach(col => {
      if (col.dataset.day === today) {
        col.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     11. SPARKLINE ANIMATION ON SCROLL
     ───────────────────────────────────────────────────── */
  function initSparklineAnimation() {
    const sparklineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const svg = entry.target;
          const path = svg.querySelector('.sparkline-path');
          const area = svg.querySelector('.sparkline-area');

          if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = 'stroke-dashoffset 1.5s ease-out';
            
            // Trigger animation
            requestAnimationFrame(() => {
              path.style.strokeDashoffset = '0';
            });
          }

          if (area) {
            area.style.opacity = '0';
            area.style.transition = 'opacity 1.5s ease-out 0.5s';
            requestAnimationFrame(() => {
              area.style.opacity = '0.3';
            });
          }

          sparklineObserver.unobserve(svg);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.sparkline-svg').forEach(svg => {
      sparklineObserver.observe(svg);
    });
  }

  /* ─────────────────────────────────────────────────────
     12. CARD HOVER PARALLAX EFFECT
     ───────────────────────────────────────────────────── */
  function initCardParallax() {
    DOM.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     13. KEYBOARD NAVIGATION
     ───────────────────────────────────────────────────── */
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Press 'F' to focus filter
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        const firstFilter = document.querySelector('.filter-btn');
        if (firstFilter) firstFilter.focus();
      }

      // Press 'G' to toggle grid view
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        const gridToggle = document.querySelector('[data-view="grid"]');
        if (gridToggle) gridToggle.click();
      }

      // Press 'L' to toggle list view
      if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
        const listToggle = document.querySelector('[data-view="list"]');
        if (listToggle) listToggle.click();
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     14. RATE BUTTON INTERACTION
     ───────────────────────────────────────────────────── */
  function initRateButtons() {
    DOM.rateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Visual feedback
        btn.style.transform = 'scale(1.2)';
        btn.style.background = 'rgba(255, 214, 0, 0.3)';
        
        setTimeout(() => {
          btn.style.transform = '';
          btn.style.background = '';
        }, 200);

        // Mascot reaction
        updateMascot('default');
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     15. PARTICLE GENERATION
     ───────────────────────────────────────────────────── */
  function initParticles() {
    const particleContainer = document.querySelector('.bg-particles');
    if (!particleContainer) return;

    function createParticle() {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 2}px;
        height: ${Math.random() * 3 + 2}px;
        background: ${['var(--accent-cyan)', 'var(--accent-magenta)', 'var(--accent-purple)', 'var(--accent-yellow)'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        opacity: ${Math.random() * 0.5 + 0.2};
        pointer-events: none;
        animation: particleRise ${Math.random() * 10 + 10}s linear forwards;
      `;
      
      particleContainer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 20000);
    }

    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleRise {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.2; }
        100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Create particles periodically
    setInterval(createParticle, 2000);
  }

  /* ─────────────────────────────────────────────────────
     INITIALIZATION
     ───────────────────────────────────────────────────── */
  function init() {
    // Run all initializations
    initStatCounters();
    initCardReveal();
    initFilters();
    initSort();
    initViewToggle();
    initSeasonSelector();
    initCountdowns();
    initMascot();
    initEpisodeTracking();
    highlightCurrentDay();
    initSparklineAnimation();
    initCardParallax();
    initKeyboardNav();
    initRateButtons();
    initParticles();

    // Log initialization
    console.log('%c AniTrack ', 'background: linear-gradient(135deg, #00f5d4, #7b2ff7); color: #07071a; padding: 4px 12px; border-radius: 4px; font-weight: bold;', 'Initialized successfully! 🎌');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
// ============================================
// INK & NEON — JavaScript
// Interactions, animations, and immersive behaviors
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSpeedLines();
  initSpotlightCarousel();
  initSeasonalTracker();
  initArchiveFilter();
  initSceneTransitions();
  initScrollAnimations();
  initHeroParallax();
});

// —— Navigation Scroll Behavior ——
function initNavigation() {
  const nav = document.getElementById('mainNav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        triggerSceneTransition(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  });
}

// —— Dynamic Speed Lines ——
function initSpeedLines() {
  const speedLines = document.getElementById('speedLines');
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    speedLines.classList.add('active');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      speedLines.classList.remove('active');
    }, 150);
  });

  // Generate dynamic speed line elements on load
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 12; i++) {
    const line = document.createElement('div');
    line.className = 'dynamic-speed-line';
    line.style.cssText = `
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(245, 240, 232, 0.08), transparent);
      width: ${Math.random() * 30 + 20}%;
      top: ${Math.random() * 100}%;
      left: -50%;
      animation: dynamic-sweep ${Math.random() * 2 + 2}s ease-in-out ${Math.random() * 3}s infinite;
    `;
    fragment.appendChild(line);
  }
  speedLines.appendChild(fragment);

  // Add keyframes for dynamic lines
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dynamic-sweep {
      0% { left: -50%; opacity: 0; }
      20% { opacity: 0.6; }
      80% { opacity: 0.6; }
      100% { left: 120%; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// —— Character Spotlight Carousel ——
function initSpotlightCarousel() {
  const track = document.getElementById('spotlightTrack');
  const cards = document.querySelectorAll('.spotlight-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('spotlightPrev');
  const nextBtn = document.getElementById('spotlightNext');

  let currentIndex = 0;
  let isAnimating = false;

  function goToSlide(index) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    // Wrap around
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    // Animate action lines on active card
    const outgoingCard = cards[currentIndex];
    const incomingCard = cards[index];

    triggerCardActionLines(outgoingCard);
    setTimeout(() => triggerCardActionLines(incomingCard), 300);

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    setTimeout(() => {
      isAnimating = false;
    }, 1200);
  }

  function triggerCardActionLines(card) {
    const lines = card.querySelectorAll('.action-line');
    lines.forEach((line, i) => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = `action-sweep 0.8s ease-out ${i * 0.1}s`;
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const spotlightSection = document.getElementById('characters');
    const rect = spotlightSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) return;

    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
  }, { passive: true });

  // Auto-advance with pause on hover
  let autoAdvance = setInterval(() => goToSlide(currentIndex + 1), 6000);
  const stage = document.querySelector('.spotlight-stage');

  stage.addEventListener('mouseenter', () => clearInterval(autoAdvance));
  stage.addEventListener('mouseleave', () => {
    autoAdvance = setInterval(() => goToSlide(currentIndex + 1), 6000);
  });
}

// —— Seasonal Tracker Day Switching ——
function initSeasonalTracker() {
  const weekBtns = document.querySelectorAll('.week-btn');
  const daySchedules = document.querySelectorAll('.day-schedule');

  weekBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;

      // Update buttons
      weekBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update schedules with stagger animation
      daySchedules.forEach(schedule => {
        if (schedule.dataset.day === day) {
          schedule.classList.add('active');
          animateScheduleSlots(schedule);
        } else {
          schedule.classList.remove('active');
        }
      });
    });
  });

  function animateScheduleSlots(schedule) {
    const slots = schedule.querySelectorAll('.anime-slot');
    slots.forEach((slot, i) => {
      slot.style.opacity = '0';
      slot.style.transform = 'translateY(20px)';
      setTimeout(() => {
        slot.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        slot.style.opacity = '1';
        slot.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }

  // Remind button toggle
  document.querySelectorAll('.remind-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      const svg = btn.querySelector('svg');

      if (isActive) {
        btn.classList.remove('active');
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Track</span>
        `;
      } else {
        btn.classList.add('active');
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Tracked</span>
        `;

        // Brief flash effect
        btn.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
        setTimeout(() => {
          btn.style.boxShadow = '';
        }, 500);
      }
    });
  });
}

// —— Archive Genre Filter ——
function initArchiveFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const archiveItems = document.querySelectorAll('.archive-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      archiveItems.forEach(item => {
        const genre = item.dataset.genre;

        if (filter === 'all' || genre === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'archive-reveal 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Add reveal animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes archive-reveal {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// —— Scene Transitions ——
function initSceneTransitions() {
  const transition = document.getElementById('sceneTransition');

  window.triggerSceneTransition = function(callback) {
    transition.classList.add('active');
    transition.style.pointerEvents = 'all';

    setTimeout(() => {
      if (callback) callback();

      setTimeout(() => {
        transition.classList.add('exiting');
        transition.classList.remove('active');

        setTimeout(() => {
          transition.classList.remove('exiting');
          transition.style.pointerEvents = 'none';
        }, 1200);
      }, 400);
    }, 600);
  };
}

// —— Scroll-Triggered Animations ——
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Trigger specific animations based on element type
        if (entry.target.classList.contains('bento-item')) {
          animateBentoItem(entry.target);
        }
        if (entry.target.classList.contains('archive-item')) {
          animateArchiveItem(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll('.bento-item, .archive-item, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // Revealed state
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

function animateBentoItem(item) {
  const delay = Array.from(item.parentNode.children).indexOf(item) * 100;
  item.style.transitionDelay = `${delay}ms`;
}

function animateArchiveItem(item) {
  const delay = Array.from(item.parentNode.children).indexOf(item) * 80;
  item.style.transitionDelay = `${delay}ms`;
}

// —— Hero Parallax Effects ——
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const heroVisual = hero.querySelector('.hero-visual');
  const heroMasthead = hero.querySelector('.hero-masthead');
  const speedLines = document.querySelectorAll('.speed-line');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroRect = hero.getBoundingClientRect();
        const heroProgress = -heroRect.top / heroRect.height;

        if (heroProgress > -1 && heroProgress < 1.5) {
          // Parallax layers
          heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
          heroMasthead.style.transform = `translateY(${scrollY * -0.05}px)`;

          // Fade out on scroll
          const opacity = Math.max(0, 1 - heroProgress * 0.8);
          hero.style.opacity = opacity;

          // Speed line intensity
          const intensity = Math.max(0.06, 0.06 + heroProgress * 0.3);
          speedLines.forEach(line => {
            line.style.opacity = intensity;
          });
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

// —— Bento Grid Hover Effects ——
document.querySelectorAll('.bento-panel').forEach(panel => {
  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const image = panel.querySelector('.panel-image');
    if (image) {
      image.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    }
  });

  panel.addEventListener('mouseleave', () => {
    const image = panel.querySelector('.panel-image');
    if (image) {
      image.style.transform = '';
    }
  });
});

// —— Character Card 3D Tilt ——
document.querySelectorAll('.spotlight-card').forEach(card => {
  const frame = card.querySelector('.card-frame');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    frame.style.transform = `perspective(1200px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
});

// —— Prefers Reduced Motion ——
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el => {
    el.style.animationDuration = '0.01ms !important';
    el.style.transitionDuration = '0.01ms !important';
  });
}

// —— Performance: Cleanup animations when not visible ——
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const animatedElements = entry.target.querySelectorAll('[class*="animation"], [class*="animate"]');
    animatedElements.forEach(el => {
      el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  });
}, { threshold: 0 });

document.querySelectorAll('section').forEach(section => {
  animationObserver.observe(section);
});
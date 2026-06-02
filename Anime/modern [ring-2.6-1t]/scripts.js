/**
 * MangaPulse – Anime & Manga Hub
 * scripts.js
 * 
 * Interactive features:
 *   - Mobile navigation toggle
 *   - Character carousel (prev/next, dots, keyboard, touch)
 *   - Seasonal genre filter with animated transitions
 *   - Scroll-reveal animations via Intersection Observer
 *   - Dynamic header style on scroll
 *   - Hero speed-line subtle motion
 *   - Active nav-link highlighting on scroll
 */

(function () {
  'use strict';

  // ── DOM Cache ──────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const header       = $('.site-header');
  const navToggle    = $('.nav-toggle');
  const navList      = $('#nav-list');
  const navLinks     = $$('.nav-list a');
  const heroTitle    = $('.hero-title');
  const speedLines   = $('.speed-lines');
  const carouselTrack= $('#carouselTrack');
  const carouselSlides = $$('.carousel-slide');
  const carouselPrev = $('.carousel-prev');
  const carouselNext = $('.carousel-next');
  const dots         = $$('.dot');
  const filterBtns   = $$('.filter-btn');
  const seasonalCards = $$('.seasonal-card');
  const revealEls    = $$('.reveal, .stagger-children');

  let currentSlide = 0;
  const SLIDE_COUNT = carouselSlides.length;
  let autoPlayTimer = null;
  const AUTO_PLAY_INTERVAL = 5000;

  // ── 1. Mobile Navigation Toggle ────────────────────────────
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ── 2. Header Scroll Behaviour ─────────────────────────────
  let lastScrollY = 0;

  function updateHeader() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 60);

    // Hide/show header on scroll direction
    if (scrollY > lastScrollY && scrollY > 300) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollY = scrollY;
  }

  // ── 3. Active Nav Highlighting ─────────────────────────────
  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) sections.push({ id: href.slice(1), el: target, link });
    }
  });

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = sections[0];

    for (const section of sections) {
      if (section.el.offsetTop <= scrollPos) {
        current = section;
      }
    }

    navLinks.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  }

  // ── 4. Hero Speed Lines Animation ──────────────────────────
  const speedLineSpans = speedLines ? speedLines.querySelectorAll('span') : [];

  function animateSpeedLines() {
    if (!speedLines) return;
    const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    speedLines.style.opacity = 0.15 + (1 - scrollProgress) * 0.35;

    speedLineSpans.forEach((span, i) => {
      const offset = Math.sin(Date.now() / 1200 + i * 0.8) * 10;
      span.style.transform = `translateX(${offset}px)`;
      span.style.opacity = 0.3 + Math.sin(Date.now() / 1500 + i) * 0.2;
    });

    requestAnimationFrame(animateSpeedLines);
  }
  animateSpeedLines();

  // ── 5. Character Carousel ──────────────────────────────────
  function goToSlide(index) {
    // Normalise index
    if (index < 0) index = SLIDE_COUNT - 1;
    if (index >= SLIDE_COUNT) index = 0;
    currentSlide = index;

    const slideWidth = carouselSlides[0].offsetWidth + 32; // width + gap
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    // Update active states
    carouselSlides.forEach((slide, i) => {
      slide.classList.toggle('active-slide', i === currentSlide);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  carouselNext.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  carouselPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      goToSlide(idx);
      resetAutoPlay();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoPlay();
    }
  });

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  // Pause on hover / focus
  const carouselWrapper = $('.carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);
    carouselWrapper.addEventListener('focusin', stopAutoPlay);
    carouselWrapper.addEventListener('focusout', startAutoPlay);
  }

  // Initialize carousel
  goToSlide(0);
  startAutoPlay();

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goToSlide(currentSlide), 200);
  });

  // ── 6. Seasonal Genre Filter ───────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const genre = btn.dataset.genre;

      seasonalCards.forEach(card => {
        const cardGenre = card.dataset.genre;
        const shouldShow = genre === 'all' || cardGenre === genre;

        if (shouldShow) {
          card.classList.remove('filtered-out');
          // Stagger reveal
          const idx = [...seasonalCards].indexOf(card);
          card.style.transitionDelay = `${idx * 0.06}s`;
        } else {
          card.style.transitionDelay = '0s';
          card.classList.add('filtered-out');
        }
      });

      // Reset delays after animation
      setTimeout(() => {
        seasonalCards.forEach(card => {
          card.style.transitionDelay = '0s';
        });
      }, 600);
    });
  });

  // ── 7. Scroll Reveal via Intersection Observer ─────────────
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Stagger children if present
        const children = entry.target.querySelectorAll('.stagger-children > *');
        if (children.length) {
          entry.target.classList.add('visible');
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(el => revealObserver.observe(el));

  // Also observe individual cards for staggered reveal
  const cardEls = $$('.manga-card, .news-card, .seasonal-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...entry.target.parentElement.children].indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  cardEls.forEach(card => cardObserver.observe(card));

  // ── 8. Smooth scroll offset for anchor links ───────────────
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.offsetTop - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── 9. Parallax effect on hero background ──────────────────
  const heroBg = $('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    }, { passive: true });
  }

  // ── 10. Particle sparkle effect for hero ───────────────────
  function createParticles() {
    const hero = $('.hero');
    if (!hero) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${3 + Math.random() * 6}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.width = `${2 + Math.random() * 3}px`;
      particle.style.height = particle.style.width;
      hero.appendChild(particle);
    }
  }
  createParticles();

  // ── Scroll event listeners ─────────────────────────────────
  function onScroll() {
    updateHeader();
    highlightActiveNav();
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  onScroll();

  // ── Console easter egg ─────────────────────────────────────
  console.log(
    '%c MangaPulse 🎌 ',
    'background: linear-gradient(135deg, #00e5ff, #7c3aed); color: #fff; font-size: 16px; padding: 8px 16px; border-radius: 8px; font-weight: bold;',
    '\nWelcome to the hub of manga & anime enthusiasts!'
  );

})();
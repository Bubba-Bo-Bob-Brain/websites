/**
 * scripts.js — 極 manga & anime
 * immersive interactions: carousel, scroll effects, speed lines
 */
(function () {
  'use strict';

  // ─── CAROUSEL (character spotlight) ───
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let cardWidth = 0;
  let visibleCards = 0;

  function computeCarouselMetrics() {
    if (!track) return;
    const firstCard = track.querySelector('.spotlight__card');
    if (!firstCard) return;
    const style = window.getComputedStyle(firstCard);
    const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
    cardWidth = firstCard.offsetWidth + gap;
    const trackWidth = track.offsetWidth;
    const cardFull = firstCard.offsetWidth;
    visibleCards = Math.floor(trackWidth / (cardFull + gap)) || 1;
  }

  function getMaxIndex() {
    const total = track.children.length;
    return Math.max(0, total - visibleCards);
  }

  function updateCarousel(animate = true) {
    if (!track) return;
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    track.style.transition = animate
      ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none';
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // update dots
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function moveCarousel(direction) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.min(maxIdx, Math.max(0, currentIndex + direction));
    updateCarousel(true);
  }

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => moveCarousel(-1));
    nextBtn.addEventListener('click', () => moveCarousel(1));

    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-slide'), 10);
        if (!isNaN(idx)) {
          currentIndex = idx;
          updateCarousel(true);
        }
      });
    });

    // initial setup
    computeCarouselMetrics();
    updateCarousel(false);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        computeCarouselMetrics();
        updateCarousel(false);
      }, 200);
    });
  }

  // ─── SEASONAL PROGRESS ANIMATION (on scroll) ───
  const progressBars = document.querySelectorAll('.seasonal__card-progress span');
  if (progressBars.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              bar.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
              bar.style.width = width;
            });
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );
    progressBars.forEach((bar) => observer.observe(bar));
  }

  // ─── MANGA PANELS HOVER GLOW ───
  const panels = document.querySelectorAll('.panels__item');
  panels.forEach((panel) => {
    panel.addEventListener('mouseenter', function () {
      this.style.zIndex = '2';
    });
    panel.addEventListener('mouseleave', function () {
      this.style.zIndex = '1';
    });
  });

  // ─── DYNAMIC SPEED LINES (parallax effect on scroll) ───
  const speedLines = document.querySelector('.speed-lines');
  if (speedLines) {
    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const delta = scrollY - lastScrollY;
          // subtle shift based on scroll direction
          const shift = delta * 0.03;
          const currentTransform = speedLines.style.transform
            ? parseFloat(speedLines.style.transform.replace(/[^\d.-]/g, '')) || 0
            : 0;
          const newShift = Math.max(-30, Math.min(30, currentTransform + shift));
          speedLines.style.transform = `translateY(${newShift}px)`;
          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ─── HEADER BLUR ENHANCE ON SCROLL ───
  const header = document.querySelector('.header');
  if (header) {
    let lastKnownScrollY = 0;
    let headerTicking = false;

    window.addEventListener('scroll', () => {
      if (!headerTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const opacity = Math.min(0.92, 0.7 + scrollY * 0.001);
          header.style.backgroundColor = `rgba(12, 11, 14, ${opacity})`;
          headerTicking = false;
        });
        headerTicking = true;
      }
    });
  }

  // ─── HERO FLOATING LINES PARALLAX ───
  const floatingLines = document.querySelector('.hero__floating-lines');
  if (floatingLines) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      floatingLines.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ─── EFFECTS DEMO: subtle hover interaction ───
  const effectCards = document.querySelectorAll('.effects-demo__card');
  effectCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      const visual = this.querySelector('.effects-demo__visual');
      if (visual) {
        visual.style.transform = 'scale(1.05)';
        visual.style.transition = 'transform 0.3s ease';
      }
    });
    card.addEventListener('mouseleave', function () {
      const visual = this.querySelector('.effects-demo__visual');
      if (visual) {
        visual.style.transform = 'scale(1)';
      }
    });
  });

  // ─── SMOOTH ANCHOR SCROLL (fallback for older browsers) ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

  // ─── INITIAL LOAD ANIMATION (stagger cards) ───
  const allCards = document.querySelectorAll(
    '.spotlight__card, .seasonal__card, .panels__item, .effects-demo__card'
  );
  allCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition =
      'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  // use IntersectionObserver for staggered entrance
  if ('IntersectionObserver' in window) {
    const appearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = Array.from(el.parentElement?.children || []).indexOf(el) * 0.06;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay * 1000);
            appearObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    allCards.forEach((card) => appearObserver.observe(card));
  } else {
    // fallback: show all immediately
    allCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  // ─── ACCESSIBILITY: live region for carousel updates ───
  const carouselRegion = document.querySelector('.spotlight__carousel');
  if (carouselRegion && !carouselRegion.hasAttribute('aria-live')) {
    carouselRegion.setAttribute('aria-live', 'polite');
  }

  console.log('極 · manga & anime — immersive experience loaded');
})();
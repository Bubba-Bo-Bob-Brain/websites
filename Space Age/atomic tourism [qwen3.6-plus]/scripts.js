/* ============================================================
   ASTRAL VOYAGES — SPACE AGE BROCHURE SCRIPTS
   ============================================================ */

(function() {
  'use strict';

  // ===== UTILITY: DOM Ready =====
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // ===== UTILITY: Throttle =====
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===== UTILITY: Generate Stars for Hero =====
  function generateStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    const colors = ['#fdf6e3', '#00a896', '#ff6b6b', '#e9c46a'];
    let boxShadows = [];

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      boxShadows.push(`${x}vw ${y}vh 0 ${color}`);
    }

    starsContainer.style.boxShadow = boxShadows.join(',');
    starsContainer.style.width = '1px';
    starsContainer.style.height = '1px';
  }

  // ===== MOBILE MENU TOGGLE =====
  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (!btn || !nav) return;

    btn.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.classList.toggle('active');
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // ===== PARALLAX SCROLL EFFECT =====
  function initParallax() {
    const panorama = document.querySelector('.panorama-section');
    const layers = document.querySelectorAll('.pano-layer');

    if (!panorama || layers.length === 0) return;

    function updateParallax() {
      const rect = panorama.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom < 0 || rect.top > windowHeight) return;

      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const offset = (progress - 0.5) * 200;

      layers.forEach((layer, i) => {
        const speed = (i + 1) * 0.3;
        const y = offset * speed;
        layer.style.transform = `translateY(${y}px)`;
      });
    }

    window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
    updateParallax();
  }

  // ===== TESTIMONIAL CAROUSEL =====
  function initCarousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    function showCard(index) {
      cards.forEach(card => card.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      cards[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');

      currentIndex = index;
    }

    function nextCard() {
      const next = (currentIndex + 1) % cards.length;
      showCard(next);
    }

    function prevCard() {
      const prev = (currentIndex - 1 + cards.length) % cards.length;
      showCard(prev);
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextCard, 6000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextCard(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevCard(); startAutoPlay(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        showCard(parseInt(dot.dataset.index, 10));
        startAutoPlay();
      });
    });

    // Touch/swipe support
    let touchStartX = 0;
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          stopAutoPlay();
          if (diff > 0) nextCard();
          else prevCard();
          startAutoPlay();
        }
      }, { passive: true });
    }

    startAutoPlay();
  }

  // ===== GMT CLOCK =====
  function initGMTclock() {
    const clockEl = document.getElementById('gmt-clock');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      const utc = now.toUTCString().split(' ')[4]; // Gets HH:MM:SS from UTC string
      clockEl.textContent = utc;
    }

    update();
    setInterval(update, 1000);
  }

  // ===== SCHEDULE BOARD ROW ANIMATION =====
  function initScheduleBoard() {
    const rows = document.querySelectorAll('.board-row');
    let currentHighlight = -1;

    function highlightRow() {
      rows.forEach(row => row.classList.remove('highlighted'));
      currentHighlight = (currentHighlight + 1) % rows.length;
      rows[currentHighlight].classList.add('highlighted');
    }

    setInterval(highlightRow, 4000);

    // Randomly toggle status for "boarding" flights
    setInterval(() => {
      const boardingRows = document.querySelectorAll('.status-boarding');
      boardingRows.forEach(row => {
        if (Math.random() > 0.7) {
          row.style.opacity = row.style.opacity === '0.5' ? '1' : '0.5';
        }
      });
    }, 800);
  }

  // ===== SCROLL-TRIGGERED REVEAL ANIMATIONS =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.section-header, .luggage-tag, .experience-card, .mascot-content, .booking-form, .testimonial-card'
    );

    revealElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${i % 3 * 0.15}s, transform 0.6s ease ${i % 3 * 0.15}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ===== BOOKING FORM =====
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      if (!data.name || !data.email || !data.destination || !data.date) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Submitting...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormMessage('Reservation request submitted! A travel consultant will contact you within 24 hours.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(message, type) {
    // Remove existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message-${type}`;
    msgEl.textContent = message;
    msgEl.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      text-align: center;
      animation: fadeIn 0.4s ease;
    `;

    if (type === 'success') {
      msgEl.style.background = 'rgba(0, 168, 150, 0.15)';
      msgEl.style.color = '#007a6d';
      msgEl.style.border = '1px solid #00a896';
    } else {
      msgEl.style.background = 'rgba(255, 107, 107, 0.15)';
      msgEl.style.color = '#e65555';
      msgEl.style.border = '1px solid #ff6b6b';
    }

    const form = document.getElementById('booking-form');
    const footer = form.querySelector('.form-footer');
    footer.parentNode.insertBefore(msgEl, footer.nextSibling);

    // Auto-remove after 6 seconds
    setTimeout(() => {
      msgEl.style.opacity = '0';
      msgEl.style.transition = 'opacity 0.4s ease';
      setTimeout(() => msgEl.remove(), 400);
    }, 6000);
  }

  // ===== HEADER SCROLL BEHAVIOR =====
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const headerHeight = header.offsetHeight;

    function onScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > headerHeight) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
      } else {
        header.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
  }

  // ===== LUGGAGE TAG HOVER TILT =====
  function initTagTilt() {
    const tags = document.querySelectorAll('.luggage-tag');

    tags.forEach(tag => {
      tag.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      });
    });
  }

  // ===== INIT ALL =====
  ready(function() {
    generateStars();
    initMobileMenu();
    initCounters();
    initParallax();
    initCarousel();
    initGMTclock();
    initScheduleBoard();
    initScrollReveal();
    initSmoothScroll();
    initBookingForm();
    initHeaderScroll();
    initTagTilt();
  });

})();
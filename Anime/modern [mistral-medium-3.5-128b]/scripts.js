// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initCarousel();
  initSeasonalTracker();
  initScrollAnimations();
  initGlitchEffects();
  initMobileMenu();
  initNewsletterForm();
  initSpotlightTilt();
  initSpeedLinesParallax();
});

// ===== Carousel =====
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-card');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  if (!track || !cards.length) return;

  const cardWidth = cards[0].offsetWidth + 20; // Including gap
  let currentIndex = 0;
  let autoScrollInterval;

  // Clone the first and last cards for seamless looping
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  // Update track position
  function updateTrack() {
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    track.style.transition = 'transform 0.5s ease';
  }

  // Handle next button click
  function next() {
    currentIndex++;
    track.style.transition = 'none';
    updateTrack();

    // If we reach the cloned first card, jump to the real first card
    if (currentIndex === cards.length) {
      setTimeout(() => {
        currentIndex = 0;
        track.style.transition = 'none';
        updateTrack();
      }, 500);
    }
  }

  // Handle previous button click
  function prev() {
    currentIndex--;
    track.style.transition = 'none';
    updateTrack();

    // If we reach the cloned last card, jump to the real last card
    if (currentIndex === -1) {
      setTimeout(() => {
        currentIndex = cards.length - 1;
        track.style.transition = 'none';
        updateTrack();
      }, 500);
    }
  }

  // Auto-scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(next, 4000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Event listeners
  nextButton.addEventListener('click', () => {
    next();
    stopAutoScroll();
    startAutoScroll();
  });

  prevButton.addEventListener('click', () => {
    prev();
    stopAutoScroll();
    startAutoScroll();
  });

  // Pause auto-scroll on hover
  track.addEventListener('mouseenter', stopAutoScroll);
  track.addEventListener('mouseleave', startAutoScroll);

  // Initialize auto-scroll
  startAutoScroll();

  // Handle window resize
  window.addEventListener('resize', () => {
    const newCardWidth = cards[0].offsetWidth + 20;
    if (newCardWidth !== cardWidth) {
      cardWidth = newCardWidth;
      updateTrack();
    }
  });
}

// ===== Seasonal Anime Tracker =====
function initSeasonalTracker() {
  const seasons = document.querySelectorAll('.tracker-season');
  const buttons = document.querySelectorAll('.tracker-button');

  if (!seasons.length || !buttons.length) return;

  // Set initial active season
  seasons[0].classList.add('active');
  buttons[0].classList.add('active');

  // Handle button clicks
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const season = button.dataset.season;

      // Update active button
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update active season
      seasons.forEach(s => {
        s.classList.remove('active');
        if (s.dataset.season === season) {
          s.classList.add('active');
        }
      });
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.panel, .carousel-card, .spotlight-card, .speech-bubble, .section-title'
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Add initial classes for animations
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Add CSS for animations (dynamically injected)
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    .panel.animate-on-scroll {
      transform: translateY(30px) rotate(2deg);
    }
    .panel.animate-in {
      transform: translateY(0) rotate(0);
    }
    .spotlight-card.animate-on-scroll {
      transform: scale(0.9) translateY(30px);
    }
    .spotlight-card.animate-in {
      transform: scale(1) translateY(0);
    }
  `;
  document.head.appendChild(style);
}

// ===== Glitch Effects =====
function initGlitchEffects() {
  const glitchButtons = document.querySelectorAll('.cta-button, .newsletter-button');

  if (!glitchButtons.length) return;

  glitchButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const glitch = button.querySelector('.button-glitch');
      if (glitch) {
        // Randomize glitch intensity
        const intensity = Math.random() * 0.3;
        glitch.style.opacity = intensity;

        // Randomize animation timing
        glitch.style.animationDuration = `${0.1 + Math.random() * 0.2}s`;
        glitch.style.animationIterationCount = `${Math.floor(Math.random() * 3) + 1}`;
      }
    });

    button.addEventListener('click', (e) => {
      // Prevent default if it's a link
      if (button.tagName === 'A') {
        e.preventDefault();
      }

      // Trigger glitch effect
      button.classList.add('glitch-active');
      setTimeout(() => {
        button.classList.remove('glitch-active');
      }, 300);
    });
  });

  // Add CSS for glitch effect
  const style = document.createElement('style');
  style.textContent = `
    .glitch-active {
      animation: glitch-shake 0.3s ease;
    }
    @keyframes glitch-shake {
      0% { transform: translate(0); }
      20% { transform: translate(-3px, 3px); }
      40% { transform: translate(-3px, -3px); }
      60% { transform: translate(3px, 3px); }
      80% { transform: translate(3px, -3px); }
      100% { transform: translate(0); }
    }
  `;
  document.head.appendChild(style);
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
  const toggleButton = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  const navList = document.querySelector('.nav-list');

  if (!toggleButton || !nav || !navList) return;

  toggleButton.addEventListener('click', () => {
    navList.classList.toggle('mobile-menu-open');
    toggleButton.textContent = navList.classList.contains('mobile-menu-open') ? '✕' : '☰';
  });

  // Close menu when clicking a link (for single-page navigation)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('mobile-menu-open');
      toggleButton.textContent = '☰';
    });
  });

  // Add CSS for mobile menu
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .nav-list {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(42, 30, 63, 0.95);
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        gap: 0.5rem;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        border-bottom: 1px solid rgba(0, 245, 255, 0.2);
      }
      .nav-list.mobile-menu-open {
        max-height: 500px;
        padding: 1rem;
      }
      .nav-link {
        font-size: 1.1rem;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== Newsletter Form =====
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  const input = document.querySelector('.newsletter-input');
  const button = document.querySelector('.newsletter-button');

  if (!form || !input || !button) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = input.value.trim();
    if (!email) {
      showFeedback('Please enter your email.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email.', 'error');
      return;
    }

    // Simulate form submission
    button.disabled = true;
    button.textContent = 'Sending...';

    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Subscribe';
      showFeedback('Thanks for subscribing!', 'success');
      input.value = '';
    }, 1500);
  });

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFeedback(message, type) {
    // Remove existing feedback
    const existingFeedback = form.querySelector('.newsletter-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `newsletter-feedback ${type}`;
    feedback.textContent = message;

    // Add CSS for feedback
    const style = document.createElement('style');
    style.textContent = `
      .newsletter-feedback {
        margin-top: 0.5rem;
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.9rem;
        text-align: center;
        animation: fadeIn 0.3s ease;
      }
      .newsletter-feedback.success {
        background: rgba(0, 255, 0, 0.2);
        color: #00ff00;
        border: 1px solid #00ff00;
      }
      .newsletter-feedback.error {
        background: rgba(255, 0, 0, 0.2);
        color: #ff0000;
        border: 1px solid #ff0000;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    form.appendChild(feedback);

    // Remove feedback after 3 seconds
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }
}

// ===== Character Spotlight Tilt Effect =====
function initSpotlightTilt() {
  const cards = document.querySelectorAll('.spotlight-card');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ===== Speed Lines Parallax Effect =====
function initSpeedLinesParallax() {
  const speedLines = document.querySelector('.speed-lines');
  if (!speedLines) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const lines = speedLines.querySelectorAll('.line');

    lines.forEach((line, index) => {
      // Adjust speed based on index for a layered parallax effect
      const speed = 0.1 + (index * 0.05);
      line.style.transform = `translateY(${scrollPosition * speed}px) skewX(30deg)`;
    });
  });
}
/* ============================================ MANGAVERSE - Interactive Features & Animations ============================================ */

/* --- DOM Elements --- */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const carousel = document.querySelector('.carousel');
const carouselTrack = document.querySelector('.carousel__track');
const carouselSlides = document.querySelectorAll('.carousel__slide');
const prevButton = document.querySelector('.carousel__arrow--prev');
const nextButton = document.querySelector('.carousel__arrow--next');
const progressBars = document.querySelectorAll('.progress-bar__fill');
const newsletterForm = document.querySelector('.newsletter-form');
const mangaPanels = document.querySelectorAll('.manga-panel');
const heroSection = document.querySelector('.hero-section');
const speedLines = document.querySelector('.speed-lines');

/* --- State Management --- */
let currentSlide = 0;
let autoPlayInterval;
const autoPlayDelay = 5000;
let isCarouselHovered = false;

/* --- Mobile Menu Toggle --- */
function initMobileMenu() {
  if (!mobileMenuToggle || !navLinks) return;

  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    mobileMenuToggle.textContent = isOpen ? '✕' : '☰';
    mobileMenuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuToggle.textContent = '☰';
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileMenuToggle.textContent = '☰';
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --- Character Spotlight Carousel --- */
function initCarousel() {
  if (!carousel || !carouselTrack || carouselSlides.length === 0) return;

  const totalSlides = carouselSlides.length;

  function showSlide(index) {
    // Wrap around
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlide = index;

    // Update slides
    carouselSlides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === currentSlide) {
        slide.classList.add('active');
      } else if (i === (currentSlide - 1 + totalSlides) % totalSlides) {
        slide.classList.add('prev');
      }
    });

    // Update ARIA attributes
    carouselSlides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (!isCarouselHovered) {
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Event Listeners
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    isCarouselHovered = true;
    stopAutoPlay();
  });

  carousel.addEventListener('mouseleave', () => {
    isCarouselHovered = false;
    startAutoPlay();
  });

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoPlay();
    }
  });

  // Initialize
  showSlide(0);
  startAutoPlay();
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.anime-card, .manga-panel, .stat, .hero-panel--left, .hero-panel--right, .about-content'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element index
        setTimeout(() => {
          entry.target.classList.add('reveal', 'active');
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }, 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

/* --- Progress Bar Animations --- */
function initProgressBars() {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressFill = entry.target;
        const progress = progressFill.getAttribute('data-progress');
        if (progress) {
          // Small delay for visual effect
          setTimeout(() => {
            progressFill.style.width = `${progress}%`;
          }, 300);
        }
        progressObserver.unobserve(progressFill);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });
}

/* --- Manga Panel Hover Effects --- */
function initMangaPanelEffects() {
  mangaPanels.forEach(panel => {
    const soundEffect = panel.querySelector('.sound-effect');
    
    panel.addEventListener('mouseenter', () => {
      // Trigger sound effect animation
      if (soundEffect) {
        soundEffect.style.animation = 'none';
        soundEffect.offsetHeight; // Trigger reflow
        soundEffect.style.animation = 'pulse 0.5s ease-in-out';
      }

      // Add a quick scale effect to the panel
      panel.style.transform = panel.style.transform || 'scale(1.05)';
    });

    panel.addEventListener('mouseleave', () => {
      // Reset transform based on original class
      const originalTransform = getComputedStyle(panel).transform;
      panel.style.transform = '';
    });

    // Click effect - create a burst
    panel.addEventListener('click', (e) => {
      createClickBurst(e.clientX, e.clientY, panel);
    });
  });
}

/* --- Click Burst Effect --- */
function createClickBurst(x, y, container) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    background: var(--color-accent-yellow);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    animation: burstEffect 0.6s ease-out forwards;
  `;
  
  document.body.appendChild(burst);
  
  setTimeout(() => {
    burst.remove();
  }, 600);
}

/* --- Hero Parallax Effect --- */
function initParallax() {
  if (!heroSection || !speedLines) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;
    
    if (scrolled < heroHeight) {
      const parallaxValue = scrolled * 0.5;
      speedLines.style.transform = `translateY(${parallaxValue}px)`;
    }
  }, { passive: true });

  // Mouse movement parallax for hero panels
  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPos = (clientX / innerWidth - 0.5) * 20;
    const yPos = (clientY / innerHeight - 0.5) * 20;

    const leftPanel = document.querySelector('.hero-panel--left');
    const rightPanel = document.querySelector('.hero-panel--right');
    
    if (leftPanel) {
      leftPanel.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px) rotate(-1deg)`;
    }
    if (rightPanel) {
      rightPanel.style.transform = `translate(${-xPos * 0.5}px, ${-yPos * 0.5}px)`;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    const leftPanel = document.querySelector('.hero-panel--left');
    const rightPanel = document.querySelector('.hero-panel--right');
    
    if (leftPanel) {
      leftPanel.style.transform = 'rotate(-1deg)';
    }
    if (rightPanel) {
      rightPanel.style.transform = 'rotate(3deg)';
    }
  });
}

/* --- Newsletter Form Handling --- */
function initNewsletter() {
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const submitButton = newsletterForm.querySelector('.newsletter-button');
    const originalText = submitButton.textContent;

    if (emailInput && emailInput.value) {
      // Simulate submission
      submitButton.textContent = 'SUBSCRIBING...';
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.textContent = 'SUBSCRIBED! ✓';
        submitButton.style.background = 'var(--color-accent-blue)';
        emailInput.value = '';

        // Reset after delay
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.style.background = '';
          submitButton.disabled = false;
        }, 3000);
      }, 1500);
    }
  });
}

/* --- Active Navigation Link on Scroll --- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.style.color = '';
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.style.color = 'var(--color-accent-yellow)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* --- Smooth Scroll for Anchor Links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- Dynamic Sound Effects on Scroll --- */
function initScrollSoundEffects() {
  const soundEffects = document.querySelectorAll('.sound-effect');
  
  const soundObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const effect = entry.target;
        effect.style.animation = 'none';
        effect.offsetHeight;
        effect.style.animation = 'pulse 0.3s ease-in-out';
        
        // Randomize animation delay for variety
        effect.style.animationDelay = `${Math.random() * 0.5}s`;
      }
    });
  }, { threshold: 0.5 });

  soundEffects.forEach(effect => {
    soundObserver.observe(effect);
  });
}

/* --- Cursor Trail Effect (Optional Polish) --- */
function initCursorTrail() {
  const trailLength = 5;
  const trails = [];
  
  for (let i = 0; i < trailLength; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
      position: fixed;
      width: ${8 - i}px;
      height: ${8 - i}px;
      background: var(--color-accent-red);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: ${0.6 - (i * 0.1)};
      transition: transform 0.1s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(trail);
    trails.push({ element: trail, x: 0, y: 0 });
  }

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateTrails() {
    let x = mouseX;
    let y = mouseY;

    trails.forEach((trail, index) => {
      const nextX = x;
      const nextY = y;
      
      trail.element.style.left = `${trail.x}px`;
      trail.element.style.top = `${trail.y}px`;
      
      trail.x = nextX;
      trail.y = nextY;
      
      x = trail.x;
      y = trail.y;
    });

    requestAnimationFrame(animateTrails);
  }

  animateTrails();
}

/* --- Performance Optimization: Debounce Scroll Events --- */
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* --- Initialize Everything --- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCarousel();
  initScrollReveal();
  initProgressBars();
  initMangaPanelEffects();
  initParallax();
  initNewsletter();
  initActiveNavLink();
  initSmoothScroll();
  initScrollSoundEffects();
  
  // Optional: Uncomment for cursor trail effect
  // initCursorTrail();
});

/* --- Handle Page Visibility Changes --- */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause carousel when tab is not visible
    stopAutoPlay();
  } else {
    // Resume carousel when tab becomes visible
    if (!isCarouselHovered) {
      startAutoPlay();
    }
  }
});

/* --- Handle Window Resize --- */
let resizeTimeout;
window.addEventListener('resize', debounce(() => {
  // Recalculate carousel if needed
  if (carousel && window.innerWidth > 768) {
    showSlide(currentSlide);
  }
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.textContent = '☰';
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }
}, 250));

/* --- Easter Egg: Konami Code --- */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateEasterEgg() {
  document.body.style.animation = 'none';
  document.body.offsetHeight; // Trigger reflow
  
  // Create a burst of random sound effects
  const sfxTexts = ['POW!', 'BAM!', 'BOOM!', 'CRASH!', 'WHAM!'];
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const sfx = document.createElement('div');
      sfx.textContent = sfxTexts[Math.floor(Math.random() * sfxTexts.length)];
      sfx.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        font-family: var(--font-display);
        font-size: ${2 + Math.random() * 3}rem;
        color: var(--color-accent-${['red', 'yellow', 'blue'][Math.floor(Math.random() * 3)]});
        text-shadow: 3px 3px 0px var(--color-outline);
        pointer-events: none;
        z-index: 10000;
        animation: float 2s ease-out forwards;
        transform: rotate(${Math.random() * 30 - 15}deg);
      `;
      document.body.appendChild(sfx);
      setTimeout(() => sfx.remove(), 2000);
    }, i * 100);
  }

  // Flash background
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    pointer-events: none;
    z-index: 9999;
    animation: flashEffect 0.5s ease-out forwards;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);
}

/* Add burst animation keyframes dynamically */
const style = document.createElement('style');
style.textContent = `
  @keyframes burstEffect {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(10);
      opacity: 0;
    }
  }
  @keyframes flashEffect {
    0% { opacity: 0.8; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);
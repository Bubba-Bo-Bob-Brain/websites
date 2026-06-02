// ===== DOM ELEMENTS =====
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel__item');
const prevButton = document.querySelector('.carousel__nav--prev');
const nextButton = document.querySelector('.carousel__nav--next');
const ctaButton = document.querySelector('.cta-button');
const radialProgress = document.querySelector('.radial-progress__progress');
const panels = document.querySelectorAll('.panel');

// ===== CAROUSEL CONFIG =====
const carouselConfig = {
  radius: 300, // Distance from center
  angleStep: 360 / carouselItems.length, // Degrees between items
  currentAngle: 0,
  autoRotateInterval: null,
  autoRotateSpeed: 0.2 // Degrees per frame
};

// ===== INITIALIZE CAROUSEL =====
function initCarousel() {
  // Position items in a circle
  carouselItems.forEach((item, index) => {
    const angle = index * carouselConfig.angleStep;
    positionCarouselItem(item, angle);
  });

  // Start auto-rotation
  startAutoRotate();
}

// Position a single carousel item
function positionCarouselItem(item, angle) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * carouselConfig.radius;
  const z = Math.cos(rad) * carouselConfig.radius;

  item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`;
}

// Rotate the carousel
function rotateCarousel(direction) {
  carouselConfig.currentAngle += direction * carouselConfig.angleStep;
  carouselItems.forEach((item, index) => {
    const angle = index * carouselConfig.angleStep + carouselConfig.currentAngle;
    positionCarouselItem(item, angle);
  });
}

// Auto-rotate the carousel
function startAutoRotate() {
  carouselConfig.autoRotateInterval = setInterval(() => {
    carouselConfig.currentAngle += carouselConfig.autoRotateSpeed;
    carouselItems.forEach((item, index) => {
      const angle = index * carouselConfig.angleStep + carouselConfig.currentAngle;
      positionCarouselItem(item, angle);
    });
  }, 16); // ~60fps
}

// Stop auto-rotation
function stopAutoRotate() {
  clearInterval(carouselConfig.autoRotateInterval);
}

// ===== EVENT LISTENERS =====
// Carousel navigation
prevButton.addEventListener('click', () => {
  rotateCarousel(1);
  stopAutoRotate();
});

nextButton.addEventListener('click', () => {
  rotateCarousel(-1);
  stopAutoRotate();
});

// Pause auto-rotation on hover
carousel.addEventListener('mouseenter', stopAutoRotate);
carousel.addEventListener('mouseleave', startAutoRotate);

// CTA button scroll
ctaButton.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector(ctaButton.getAttribute('href'));
  smoothScroll(target, 800);
});

// ===== SMOOTH SCROLLING =====
function smoothScroll(target, duration) {
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Easing function: easeOutQuad
  function ease(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  }

  requestAnimationFrame(animation);
}

// ===== SEASONAL TRACKER ANIMATION =====
function animateSeasonalTracker() {
  let progress = 0;
  const maxProgress = 339.292; // Full circle circumference
  const targetProgress = 84.823; // 25% progress (Summer 2024)

  const interval = setInterval(() => {
    progress += maxProgress / 50; // Animate over 50 steps
    if (progress >= targetProgress) {
      progress = targetProgress;
      clearInterval(interval);
    }
    radialProgress.style.strokeDashoffset = maxProgress - progress;
  }, 20);
}

// ===== PANEL HOVER EFFECTS (ENHANCED) =====
panels.forEach(panel => {
  // Add speed lines on hover
  panel.addEventListener('mouseenter', () => {
    if (!panel.querySelector('.speed-lines')) {
      const speedLines = document.createElement('div');
      speedLines.className = 'speed-lines';
      speedLines.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0" stroke="var(--accent-cyan)" stroke-width="0.5" opacity="0.3"/>
          <path d="M0,10 L100,10" stroke="var(--accent-magenta)" stroke-width="0.5" opacity="0.3"/>
          <path d="M0,20 L100,20" stroke="var(--accent-cyan)" stroke-width="0.5" opacity="0.2"/>
        </svg>
      `;
      panel.appendChild(speedLines);
    }
  });

  panel.addEventListener('mouseleave', () => {
    const speedLines = panel.querySelector('.speed-lines');
    if (speedLines) speedLines.remove();
  });
});

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', () => {
  initCarousel();
  animateSeasonalTracker();

  // Add halftone effect to editorial cards
  document.querySelectorAll('.card').forEach(card => {
    const halftone = card.querySelector('.card__halftone');
    halftone.style.backgroundSize = `${Math.random() * 3 + 2}px ${Math.random() * 3 + 2}px`;
  });
});
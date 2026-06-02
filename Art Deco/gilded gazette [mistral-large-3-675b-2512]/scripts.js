// ===== CHAMPAGNE BUBBLES =====
class ChampagneBubbles {
  constructor(container) {
    this.container = container;
    this.bubbles = [];
    this.init();
  }

  init() {
    // Create 50 bubbles
    for (let i = 0; i < 50; i++) {
      this.createBubble();
    }
    this.animate();
  }

  createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('champagne-bubble');

    // Random size (3-15px)
    const size = Math.random() * 12 + 3;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Random position (within container)
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = `-${size}px`;

    // Random animation duration (5-15s) and delay (0-5s)
    bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;

    this.container.appendChild(bubble);
    this.bubbles.push(bubble);
  }

  animate() {
    // Recreate bubbles that floated away
    setInterval(() => {
      this.bubbles.forEach(bubble => {
        if (parseFloat(bubble.style.bottom) > 100) {
          bubble.remove();
          this.createBubble();
        }
      });
    }, 1000);
  }
}

// Initialize bubbles for champagne ad
document.addEventListener('DOMContentLoaded', () => {
  const champagneAd = document.querySelector('.champagne-ad');
  if (champagneAd) {
    new ChampagneBubbles(champagneAd.querySelector('.champagne-bubbles'));
  }
});

// ===== PARALLAX HERO =====
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroSunburst = document.querySelector('.hero-sunburst');

window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  // Parallax effect: sunburst moves slower than content
  heroSunburst.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
});

// ===== MASTHEAD JAZZ GLYPHS =====
const jazzGlyphs = document.querySelectorAll('.glyph');
jazzGlyphs.forEach((glyph, index) => {
  // Stagger animation delays
  glyph.style.animationDelay = `${index * 0.5}s`;
});

// ===== SCROLL ANIMATIONS =====
const animateOnScroll = () => {
  const articles = document.querySelectorAll('.article-card, .opinion-article, .feature-article');

  articles.forEach(article => {
    const articlePosition = article.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (articlePosition < screenPosition) {
      article.classList.add('fade-in');
    }
  });
};

// Run on load and scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// ===== LAZY LOAD IMAGES =====
const lazyLoadImages = () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight + 100) {
      img.src = img.dataset.src || img.src; // Fallback for browsers without lazy-loading
    }
  });
};

window.addEventListener('load', lazyLoadImages);
window.addEventListener('scroll', lazyLoadImages);

// ===== GOLD-FOIL HOVER EFFECTS =====
const goldFoilElements = document.querySelectorAll('.hero-button, .read-more, .ad-button, .nav-item a');

goldFoilElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'scale(1.05)';
    element.style.textShadow = '0 0 10px var(--gold-light)';
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
    element.style.textShadow = 'none';
  });
});
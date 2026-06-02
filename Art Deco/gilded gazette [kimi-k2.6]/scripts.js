// ============================================================
// THE GILDED CHRONICLE — JavaScript
// Champagne bubbles, scroll reveals, parallax, and interactive flourishes
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  initChampagneBubbles();
  initScrollReveal();
  initParallaxHero();
  initMastheadAnimation();
  initSmoothScroll();
  initMagneticButtons();
  initTextScramble();
  initGeometricDividers();
});

// —— Champagne Bubble Particle System ——
function initChampagneBubbles() {
  const canvas = document.getElementById('bubbleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let bubbles = [];
  let animationId;
  let isActive = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Bubble {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 0.5;
      this.speed = Math.random() * 1.5 + 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.wobbleAmount = Math.random() * 1.5 + 0.5;
      this.gold = {
        r: 201 + Math.random() * 30 - 15,
        g: 162 + Math.random() * 30 - 15,
        b: 39 + Math.random() * 20 - 10
      };
    }

    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * this.wobbleAmount;

      const lifeRatio = 1 - (this.y / canvas.height);
      this.currentOpacity = this.opacity * (0.3 + lifeRatio * 0.7);

      if (this.y < -this.size * 2) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        this.x - this.size * 0.3,
        this.y - this.size * 0.3,
        0,
        this.x,
        this.y,
        this.size
      );

      gradient.addColorStop(0, `rgba(255, 248, 220, ${this.currentOpacity * 0.9})`);
      gradient.addColorStop(0.4, `rgba(${this.gold.r}, ${this.gold.g}, ${this.gold.b}, ${this.currentOpacity * 0.6})`);
      gradient.addColorStop(1, `rgba(${this.gold.r}, ${this.gold.g}, ${this.gold.b}, ${this.currentOpacity * 0.1})`);

      ctx.fillStyle = gradient;
      ctx.fill();

      // Highlight
      ctx.beginPath();
      ctx.arc(
        this.x - this.size * 0.25,
        this.y - this.size * 0.25,
        this.size * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity * 0.8})`;
      ctx.fill();
    }
  }

  const bubbleCount = Math.min(80, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = new Bubble();
    bubble.y = Math.random() * canvas.height;
    bubbles.push(bubble);
  }

  function animate() {
    if (!isActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(bubble => {
      bubble.update();
      bubble.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      isActive = false;
      cancelAnimationFrame(animationId);
    } else {
      isActive = true;
      animate();
    }
  });
}

// —— Scroll Reveal Animation ——
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.article-header, .article-body p, .pull-quote-block, ' +
    '.article-subhead, .inline-image, .author-bio, ' +
    '.feature-card, .ad-block, .toc-item, .fashion-plate, ' +
    '.features-title, .footer-content'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index % 3 * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

// —— Parallax Hero Effect ——
function initParallaxHero() {
  const heroSection = document.querySelector('.hero-section');
  const sunburstRays = document.querySelector('.sunburst-rays');
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image-frame');

  if (!heroSection) return;

  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);

        if (sunburstRays) {
          sunburstRays.style.transform = `rotate(${scrollY * 0.1}deg)`;
          sunburstRays.style.opacity = 1 - progress * 0.7;
        }

        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
          heroContent.style.opacity = 1 - progress * 0.8;
        }

        if (heroImage) {
          heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// —— Masthead Character Animation ——
function initMastheadAnimation() {
  const titleMain = document.querySelector('.title-main');
  if (!titleMain) return;

  const text = titleMain.textContent;
  titleMain.innerHTML = '';

  const chars = text.split('');
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px) rotateX(-90deg)';
    span.style.transition = `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.04}s`;
    titleMain.appendChild(span);
  });

  setTimeout(() => {
    const spans = titleMain.querySelectorAll('span');
    spans.forEach(span => {
      span.style.opacity = '1';
      span.style.transform = 'translateY(0) rotateX(0)';
    });
  }, 300);
}

// —— Smooth Scroll Navigation ——
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// —— Magnetic Button Effect ——
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.hero-cta, .nav-link');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    el.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    el.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.1s ease-out';
    });
  });
}

// —— Text Scramble Effect for Section Labels ——
function initTextScramble() {
  const labels = document.querySelectorAll('.article-section-label, .hero-label');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  labels.forEach(label => {
    const originalText = label.textContent;
    let iteration = 0;

    label.addEventListener('mouseenter', function() {
      iteration = 0;
      const interval = setInterval(() => {
        this.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iteration += 1 / 2;

        if (iteration >= originalText.length) {
          this.textContent = originalText;
          clearInterval(interval);
        }
      }, 30);
    });
  });
}

// —— Animated Geometric Dividers ——
function initGeometricDividers() {
  const dividers = document.querySelectorAll('.divider-geometric');

  dividers.forEach(divider => {
    const diamonds = divider.querySelectorAll('.diamond-small, .diamond-large');

    divider.addEventListener('mouseenter', function() {
      diamonds.forEach((d, i) => {
        d.style.transition = `transform 0.5s cubic-bezier(0.68, -0.15, 0.265, 1.15) ${i * 0.1}s`;
        d.style.transform = 'rotate(225deg) scale(1.2)';
      });
    });

    divider.addEventListener('mouseleave', function() {
      diamonds.forEach((d, i) => {
        d.style.transition = `transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.05}s`;
        d.style.transform = '';
      });
    });
  });
}

// —— Decorative: Animated corner accents on scroll ——
(function initCornerAccents() {
  const corners = document.querySelectorAll('.border-corner');

  function pulseCorners() {
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    corners.forEach((corner, i) => {
      const delay = i * 0.2;
      const intensity = 0.3 + Math.sin((scrollProgress * Math.PI * 2) + delay) * 0.3;
      corner.style.borderColor = `rgba(201, 162, 39, ${intensity})`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        pulseCorners();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// —— Decorative: Table of Contents number counter animation ——
(function initTocCounters() {
  const tocItems = document.querySelectorAll('.toc-item');

  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberEl = entry.target.querySelector('.toc-number');
        const finalNumber = numberEl.textContent;
        let current = 0;
        const target = parseInt(finalNumber, 10);

        const counter = setInterval(() => {
          current++;
          numberEl.textContent = current.toString().padStart(2, '0');
          if (current >= target) {
            clearInterval(counter);
          }
        }, 60);

        tocObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  tocItems.forEach(item => tocObserver.observe(item));
})();

// —— Decorative: Card shimmer effect on hover ——
(function initCardShimmer() {
  const cards = document.querySelectorAll('.feature-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const frame = this.querySelector('.card-frame');
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(201, 162, 39, 0.08) 50%,
          transparent 100%
        );
        transition: left 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        pointer-events: none;
        z-index: 2;
      `;

      frame.style.position = 'relative';
      frame.style.overflow = 'hidden';
      frame.appendChild(shimmer);

      requestAnimationFrame(() => {
        shimmer.style.left = '150%';
      });

      setTimeout(() => shimmer.remove(), 800);
    });
  });
})();
// ===== GLOBAL UTILITIES =====
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// ===== 1. JAZZY ANIMATED MASTHEAD =====
(function initMasthead() {
  const masthead = document.querySelector('.masthead');
  if (!masthead) return;

  const title = masthead.querySelector('.masthead-title');
  const subtitle = masthead.querySelector('.masthead-subtitle');
  const date = masthead.querySelector('.masthead-date');
  const sunburst = masthead.querySelector('.sunburst');

  // Stagger entrance
  const elements = [subtitle, title, date];
  elements.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    el.style.transitionDelay = `${0.2 + i * 0.25}s`;
  });

  requestAnimationFrame(() => {
    elements.forEach(el => {
      if (!el) return;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Subtle shimmer on sunburst
  if (sunburst) {
    sunburst.style.transition = 'opacity 2s ease';
    sunburst.style.opacity = '0';
    requestAnimationFrame(() => {
      sunburst.style.opacity = '1';
    });
  }
})();

// ===== 2. PARALLAX HERO =====
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const content = hero.querySelector('.hero-content');
  const sunburst = hero.querySelector('.hero-sunburst');
  const overlay = hero.querySelector('.hero-overlay');

  const handleScroll = () => {
    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const offset = viewportHeight - rect.top;
    const progress = Math.max(0, Math.min(1, offset / (viewportHeight + rect.height)));

    // Parallax shift
    const shift = progress * 60 - 30;
    if (content) {
      content.style.transform = `translateY(${shift * 0.3}px)`;
    }
    if (sunburst) {
      sunburst.style.transform = `translate(-50%, -50%) rotate(${progress * 20}deg)`;
    }
    if (overlay) {
      overlay.style.opacity = 0.6 + progress * 0.4;
    }
  };

  window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
  handleScroll();
})();

// ===== 3. CHAMPAGNE BUBBLE PARTICLE EFFECT =====
(function initBubbleParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  canvas.style.mixBlendMode = 'screen';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let animationId;
  let bubbles = [];
  const BUBBLE_COUNT = 35;
  const MAX_RADIUS = 12;

  const resize = () => {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  };

  const createBubble = () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + 20 + Math.random() * 100,
    radius: 2 + Math.random() * MAX_RADIUS,
    speedY: 0.3 + Math.random() * 0.8,
    speedX: (Math.random() - 0.5) * 0.3,
    opacity: 0.15 + Math.random() * 0.25,
    hue: 40 + Math.random() * 20, // gold/champagne
    life: 0,
    maxLife: 300 + Math.random() * 400,
  });

  const initBubbles = () => {
    bubbles = Array.from({ length: BUBBLE_COUNT }, () => createBubble());
  };

  const drawBubble = (b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, 0, b.x, b.y, b.radius);
    gradient.addColorStop(0, `hsla(${b.hue}, 80%, 70%, ${b.opacity * 0.6})`);
    gradient.addColorStop(0.5, `hsla(${b.hue}, 60%, 50%, ${b.opacity * 0.3})`);
    gradient.addColorStop(1, `hsla(${b.hue}, 40%, 30%, ${b.opacity * 0.1})`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.arc(b.x - b.radius * 0.25, b.y - b.radius * 0.25, b.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 100%, 90%, ${b.opacity * 0.5})`;
    ctx.fill();
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(b => {
      b.y -= b.speedY;
      b.x += b.speedX * Math.sin(b.life * 0.02);
      b.life++;

      // Wobble
      b.x += Math.sin(b.life * 0.03) * 0.2;

      drawBubble(b);

      // Reset if out of bounds or expired
      if (b.y + b.radius < 0 || b.life > b.maxLife) {
        Object.assign(b, createBubble());
        b.y = canvas.height + 20;
        b.life = 0;
      }
    });

    animationId = requestAnimationFrame(animate);
  };

  resize();
  initBubbles();
  animate();

  window.addEventListener('resize', debounce(resize, 200));

  // Cleanup on page unload (optional, but good practice)
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
})();

// ===== 4. SCROLL-REVEAL FOR ARTICLES & DIVIDERS =====
(function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.feature-article, .mini-feature, .advertisement, .sidebar .poster-ad, .col, .feature-block-inner'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
})();

// ===== 5. GOLD DIVIDER PULSE =====
(function initDividerPulse() {
  const dividers = document.querySelectorAll('.gold-divider');
  dividers.forEach((divider, index) => {
    const diamond = divider.querySelector('::before');
    // Animate diamond via class (CSS handles the rest)
    divider.style.transition = 'background 0.3s ease';
    divider.addEventListener('mouseenter', () => {
      divider.style.background = 'linear-gradient(90deg, transparent 0%, var(--gold-light) 20%, #f0e68c 50%, var(--gold-light) 80%, transparent 100%)';
    });
    divider.addEventListener('mouseleave', () => {
      divider.style.background = '';
    });
  });
})();

// ===== 6. NAVIGATION ACTIVE STATE (simple scroll spy) =====
(function initNavSpy() {
  const navLinks = document.querySelectorAll('.main-nav a');
  if (!navLinks.length) return;

  const sections = document.querySelectorAll('section, article, .feature-block');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.borderBottom = '';
        });
        // Not using IDs in this layout, so we do a simple visual reset on hover
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ===== 7. HOVER EFFECT ON POSTER ADS =====
(function initPosterHover() {
  const posters = document.querySelectorAll('.poster-frame');
  posters.forEach(poster => {
    poster.addEventListener('mouseenter', () => {
      poster.style.borderColor = 'var(--gold-light)';
      poster.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.3), inset 0 0 30px rgba(201, 168, 76, 0.05)';
      poster.style.transition = 'all 0.3s ease';
    });
    poster.addEventListener('mouseleave', () => {
      poster.style.borderColor = '';
      poster.style.boxShadow = '';
    });
  });
})();

// ===== 8. DYNAMIC DATE UPDATE =====
(function updateDate() {
  const dateEl = document.querySelector('.masthead-date');
  if (!dateEl) return;

  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Keep the 1925 theme but show current day/month for realism
  const formatted = now.toLocaleDateString('en-US', options).replace(/\d{4}/, '1925');
  dateEl.textContent = `New York — ${formatted}`;
})();

// ===== 9. SMOOTH SCROLL FOR READ MORE LINKS =====
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ===== 10. HERO CTA GLOW PULSE =====
(function initHeroGlow() {
  const cta = document.querySelector('.hero-cta');
  if (!cta) return;

  let glowPhase = 0;
  const pulse = () => {
    glowPhase = (glowPhase + 0.02) % (Math.PI * 2);
    const intensity = 0.2 + Math.sin(glowPhase) * 0.15;
    cta.style.boxShadow = `0 0 ${20 + intensity * 20}px rgba(201, 168, 76, ${intensity})`;
    requestAnimationFrame(pulse);
  };
  pulse();
})();

console.log('The Gilded Gazette — Art Deco Magazine, 1925');
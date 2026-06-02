/**
 * THE GATSBY GAZETTE - Interactive Scripts
 * Art Deco elegance meets modern interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initChampagneParticles();
  initSunburstRays();
  initScrollAnimations();
  initParallaxEffects();
  initNavigation();
  initMagneticElements();
  initTextScramble();
  initCardTilt();
});

// ============================================
// CHAMPAGNE BUBBLE PARTICLE SYSTEM
// ============================================
function initChampagneParticles() {
  const canvas = document.getElementById('champagne-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isActive = true;

  // Check for touch device - disable on mobile for performance
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) {
    canvas.style.display = 'none';
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Bubble {
    constructor() {
      this.reset();
      // Start at random y position initially
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speed = Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.gold = Math.random() > 0.5 ? '#D4AF37' : '#F4E4BC';
    }

    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5;

      // Reset if off top of screen
      if (this.y < -10) {
        this.reset();
      }

      // Mouse interaction (subtle repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x += (dx / distance) * force * 2;
          this.y += (dy / distance) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      
      // Add highlight
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = this.opacity * 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Track mouse for interaction
  const mouse = { x: null, y: null };
  
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create particles
  const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Bubble());
  }

  // Animation loop with visibility check
  function animate() {
    if (!isActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      cancelAnimationFrame(animationId);
    } else {
      isActive = true;
      animate();
    }
  });

  animate();
}

// ============================================
// SUNBURST RAY GENERATION
// ============================================
function initSunburstRays() {
  const container = document.querySelector('.sunburst-rays');
  if (!container) return;

  const rayCount = 24;
  const centerX = 50;
  const centerY = 50;
  const radius = 70;

  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * 360;
    const ray = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    const x1 = centerX;
    const y1 = centerY;
    const x2 = centerX + Math.cos((angle * Math.PI) / 180) * radius;
    const y2 = centerY + Math.sin((angle * Math.PI) / 180) * radius;

    ray.setAttribute('x1', x1);
    ray.setAttribute('y1', y1);
    ray.setAttribute('x2', x2);
    ray.setAttribute('y2', y2);
    ray.setAttribute('stroke', 'url(#gold-gradient)');
    ray.setAttribute('stroke-width', Math.random() * 2 + 0.5);
    ray.setAttribute('stroke-linecap', 'round');
    ray.setAttribute('opacity', Math.random() * 0.3 + 0.1);

    // Add animation delay for staggered appearance
    ray.style.animation = `rayPulse 4s ease-in-out ${i * 0.1}s infinite alternate`;
    
    container.appendChild(ray);
  }

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rayPulse {
      0% { stroke-opacity: 0.1; stroke-width: 0.5; }
      100% { stroke-opacity: 0.4; stroke-width: 2; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Special handling for headline words
        if (entry.target.classList.contains('headline-word')) {
          const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Elements to animate
  const selectors = [
    '.column-card',
    '.article-body p',
    '.pull-quote',
    '.inline-image',
    '.feature-text',
    '.section-title',
    '.ad-unit'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  });

  // Add revealed class styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallaxEffects() {
  const heroSection = document.querySelector('.hero-section');
  const sunburst = document.querySelector('.sunburst-container');
  const heroContent = document.querySelector('.hero-content');
  
  if (!heroSection || isTouchDevice()) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (sunburst) {
          sunburst.style.transform = `translate(-50%, -50%) rotate(${rate * 0.1}deg)`;
        }
        
        if (heroContent) {
          heroContent.style.transform = `translateY(${rate * 0.3}px)`;
          heroContent.style.opacity = 1 - (scrolled / 700);
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const nav = document.querySelector('.main-navigation');
  const links = document.querySelectorAll('.nav-menu a');
  
  // Sticky nav enhancement
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // Smooth scroll for anchor links
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 100; // Account for sticky nav
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ============================================
// MAGNETIC ELEMENTS (Buttons & Links)
// ============================================
function initMagneticElements() {
  if (isTouchDevice()) return;

  const magneticElements = document.querySelectorAll('.cta-button, .read-link, .vintage-button');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.3s ease';
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease';
    });
  });
}

// ============================================
// TEXT SCRAMBLE EFFECT (Masthead)
// ============================================
function initTextScramble() {
  const title = document.querySelector('.title-main');
  if (!title || isTouchDevice()) return;

  const originalText = title.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let iteration = 0;
  let interval = null;

  title.addEventListener('mouseenter', () => {
    clearInterval(interval);
    iteration = 0;
    
    interval = setInterval(() => {
      title.textContent = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 50);
  });

  title.addEventListener('mouseleave', () => {
    clearInterval(interval);
    title.textContent = originalText;
  });
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================
function initCardTilt() {
  if (isTouchDevice()) return;

  const cards = document.querySelectorAll('.column-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      card.style.transition = 'transform 0.1s';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

// ============================================
// UTILITIES
// ============================================
function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches;
}

// Add class to body for CSS targeting
if (isTouchDevice()) {
  document.body.classList.add('touch-device');
}

// Performance: Debounce function
function debounce(func, wait) {
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

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-smooth', 'none');
  document.documentElement.style.setProperty('--transition-dramatic', 'none');
}